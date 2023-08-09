import getopt
import os
import sys
from datetime import datetime

from flair.nn import Classifier
from flair.splitter import SegtokSentenceSplitter


def main(argv):
    # Default model is "de-ner-large"
    model = "de-ner-large"

    # Parse command line arguments
    opts, args = getopt.getopt(argv, "m:", ["model="])
    for opt, arg in opts:
        if opt == "--model":
            model = arg

    input_file_path = args[0]

    startTime = datetime.now()

    with open(input_file_path, "r") as file:
        file = file.read()

    # initialize sentence splitter
    splitter = SegtokSentenceSplitter()

    # use splitter to split text into list of sentences
    sentences = splitter.split(file)

    # load the NER tagger
    tagger = Classifier.load(model)

    # run NER over the sentences
    tagger.predict(sentences)

    # Create a new output file, next to the input file, with the " [ner]" suffix
    output_file_path = input_file_path.replace(".txt", " [ner].txt")

    # if the file already exists, delete it
    try:
        os.remove(output_file_path)
    except OSError:
        pass

    # print the sentence with all annotations
    for sentence in sentences:
        if sentence.get_labels():
            with open(output_file_path, "a") as file:
                file.write(str(sentence) + "\n")

    print(datetime.now() - startTime)


if __name__ == "__main__":
    main(sys.argv[1:])
