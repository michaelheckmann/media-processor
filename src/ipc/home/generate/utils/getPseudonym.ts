import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

/**
 * The function `getPseudonym` generates a random pseudonym using a given name as a seed.
 * @param {string} name - The `name` parameter is a string that represents the seed value used for
 * generating the pseudonym. The seed value ensures that the same input name will always produce the
 * same pseudonym.
 * @returns The function `getPseudonym` returns a randomly generated pseudonym based on the input
 * `name`.
 */
export const getPseudonym = (name: string) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    seed: name,
  });
  return randomName;
};
