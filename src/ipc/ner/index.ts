import { spawn } from "child_process";
import { IpcMainInvokeEvent } from "electron";
import { dirname, join } from "path";

/**
 * Creates or activates a Python virtual environment in the specified folder path
 * and installs the specified dependency if it's not already installed.
 * @param dirPath The path to the folder where the virtual environment should be created or activated
 * @param dependency The name of the dependency to install (default: "flair")
 */
export const createOrActivateVirtualEnv = async (
  dirPath: string,
  dependency = "flair"
) => {
  // Check if the virtual environment already exists
  const venvDirPath = join(dirPath, "venv");
  const venvExists = await new Promise<boolean>((resolve, reject) => {
    const process = spawn("test", ["-d", venvDirPath], {
      stdio: "inherit",
      shell: true,
    });

    process.on("close", (code) => {
      if (code !== 0) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
  console.log("venvExists ~ venvExists:", venvExists);

  // Create the virtual environment if it doesn't exist
  if (!venvExists) {
    const process = spawn("python3", ["-m", "venv", venvDirPath], {
      stdio: "inherit",
      shell: true,
    });

    await new Promise<void>((resolve, reject) => {
      process.on("close", (code) => {
        if (code !== 0) {
          reject(new Error("Failed to create virtual environment"));
        } else {
          resolve();
        }
      });
    });
  }

  // Activate the virtual environment and check if the dependency is already installed
  const activateScriptPath = join(venvDirPath, "bin", "activate");
  const activateCommand = `source ${activateScriptPath}`;
  const checkCommand = `pip show ${dependency}`;

  const checkProcess = spawn(`${activateCommand} && ${checkCommand}`, {
    stdio: "inherit",
    shell: true,
    cwd: dirPath,
  });

  const dependencyInstalled = await new Promise<boolean>((resolve, reject) => {
    checkProcess.on("close", (code) => {
      if (code !== 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
  console.log(
    "dependencyInstalled ~ dependencyInstalled:",
    dependencyInstalled
  );

  // Install the dependency if it's not already installed
  if (!dependencyInstalled) {
    const installCommand = `pip install ${dependency}`;

    const process = spawn(`${activateCommand} && ${installCommand}`, {
      stdio: "inherit",
      shell: true,
      cwd: dirPath,
    });

    await new Promise<void>((resolve, reject) => {
      process.on("close", (code) => {
        if (code !== 0) {
          reject(new Error("Failed to install dependency"));
        } else {
          resolve();
        }
      });
    });
  }
};

export const runNER = async (
  _: IpcMainInvokeEvent,
  scriptFilePath: string,
  txtFilePath: string,
  model?: string
) => {
  const safeTXTFilePath = txtFilePath.replace(/(\s+)/g, "\\$1");
  const scriptDirPath = dirname(scriptFilePath);

  await createOrActivateVirtualEnv(scriptDirPath);

  const pythonPath = join(scriptDirPath, "venv", "bin", "python3");
  const scriptPath = join(scriptDirPath, "main.py");
  const modelFlag = `--model=${model ?? "de-ner-large"}`;

  const process = spawn(pythonPath, [scriptPath, modelFlag, safeTXTFilePath], {
    shell: true,
  });

  return new Promise<boolean>((resolve, reject) => {
    process.on("close", (code) => {
      if (code !== 0) {
        console.log(`Python script exited with code ${code}`);
        resolve(false);
        return;
      }
      spawn("open", [dirname(txtFilePath)]);
      resolve(true);
    });
  });
};
