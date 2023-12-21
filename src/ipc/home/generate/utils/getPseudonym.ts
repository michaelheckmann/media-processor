import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

const excludedAdjectives = [
  "aggressive",
  "annoyed",
  "appaling",
  "arrogant",
  "bad",
  "blind",
  "boring",
  "capitalist",
  "cheap",
  "christian",
  "chubby",
  "disgusted",
  "bloody",
  "civilian",
  "combative",
  "conservative",
  "imperial",
  "liberal",
  "marxist",
  "mute",
  "native",
  "political",
  "primitive",
  "colonial",
  "coming",
  "deaf",
  "disabled",
  "drunk",
  "ethnic",
  "fat",
  "female",
  "feminist",
  "filthy",
  "homeless",
  "inappropriate",
  "intimate",
  "male",
  "oral",
  "sexual",
  "socialist",
  "stupid",
  "thick",
  "thin",
  "thirsty",
  "tory",
  "xenophobic",
  "awful",
];

/**
 * The function `getAlternativeAdjective` takes an adjective as input and returns an alternative
 * adjective from a list of adjectives, excluding any adjectives specified in the `excludedAdjectives`
 * array.
 * @param {string} adjective - The `adjective` parameter in the `getAlternativeAdjective` function is a
 * string that represents the original adjective for which we want to find an alternative.
 * @returns The function `getAlternativeAdjective` returns an alternative adjective based on the input
 * adjective.
 */
const getAlternativeAdjective = (adjective: string) => {
  const alternativeAdjectives = adjectives.filter(
    (a) => !excludedAdjectives.includes(a)
  );

  const adjectiveHash = adjective
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const alternativeAdjective =
    alternativeAdjectives[adjectiveHash % alternativeAdjectives.length];
  return alternativeAdjective;
};

/**
 * The function `getPseudonym` generates a random pseudonym using a given name as a seed.
 * @param {string} name - The `name` parameter is a string that represents the seed value used for
 * generating the pseudonym. The seed value ensures that the same input name will always produce the
 * same pseudonym.
 * @returns The function `getPseudonym` returns a randomly generated pseudonym based on the input
 * `name`.
 */
export const getPseudonym = (name: string) => {
  const separator = "_";
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    seed: name,
    separator,
  });
  const [adjective, animal] = randomName.split(separator);
  if (excludedAdjectives.includes(adjective)) {
    const alternativeAdjective = getAlternativeAdjective(adjective);
    return [alternativeAdjective, animal].join(separator);
  }
  return randomName;
};
