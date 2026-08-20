import { describe, expect, it } from "vitest";
import { deriveCatalog, splitKey } from "@/lib/parse-song-meta";
import { titleCase } from "@/lib/title-case";

const titlesFor = (keys: string[]) => deriveCatalog(keys).map((s) => s.title);

describe("titleCase", () => {
  it("capitalizes each significant word", () => {
    expect(titleCase("baby parasite")).toBe("Baby Parasite");
  });

  it("keeps minor words lowercase inside the title", () => {
    expect(titleCase("left static and at ease")).toBe(
      "Left Static and at Ease",
    );
  });

  it("still capitalizes a minor word in the first or last position", () => {
    expect(titleCase("the fog")).toBe("The Fog");
    expect(titleCase("bring it on")).toBe("Bring It On");
  });

  it("capitalizes past leading punctuation", () => {
    expect(titleCase("sustenance pt 1 (body love)")).toBe(
      "Sustenance Pt 1 (Body Love)",
    );
  });

  it("leaves numeric words alone", () => {
    expect(titleCase("13 days")).toBe("13 Days");
  });
});

describe("splitKey", () => {
  it("takes the album from the folder, verbatim", () => {
    expect(splitKey("three./02 slowwalk.flac")).toMatchObject({
      album: "three.",
      name: "02 slowwalk",
    });
  });

  it("files a root-level object under Singles", () => {
    expect(splitKey("wanderer.mp3")).toMatchObject({
      album: "Singles",
      name: "wanderer",
    });
  });
});

describe("deriveCatalog", () => {
  it("strips arabic track numbers when the album uses them", () => {
    const catalog = deriveCatalog([
      "hifiveyourself/01 blanket blanket.mp3",
      "hifiveyourself/02 tongue tied.mp3",
      "hifiveyourself/03 horsey.mp3",
    ]);
    expect(catalog.map((s) => s.title)).toEqual([
      "Blanket Blanket",
      "Tongue Tied",
      "Horsey",
    ]);
    expect(catalog.map((s) => s.track)).toEqual([1, 2, 3]);
  });

  it("strips roman track numbers when the album uses them", () => {
    expect(
      titlesFor([
        "seemsreal/i you turned loose.mp3",
        "seemsreal/ii sound of passing time.mp3",
        "seemsreal/iv the patient ancients.mp3",
      ]),
    ).toEqual([
      "You Turned Loose",
      "Sound of Passing Time",
      "The Patient Ancients",
    ]);
  });

  it("orders roman-numbered tracks numerically, not lexicographically", () => {
    const catalog = deriveCatalog([
      "seemsreal/iv the patient ancients.mp3",
      "seemsreal/ix in planted fancy.mp3",
      "seemsreal/v integrated correlate.mp3",
      "seemsreal/viii churros.mp3",
    ]);
    expect(catalog.map((s) => s.track)).toEqual([4, 5, 8, 9]);
  });

  it("does not eat a leading 'I' that is part of the title", () => {
    // Only one track here looks numbered, so the album has no scheme.
    expect(
      titlesFor([
        "hifiveyourself/i can not not wear my face.mp3",
        "hifiveyourself/blanket blanket.mp3",
        "hifiveyourself/tongue tied.mp3",
      ]),
    ).toContain("I Can Not Not Wear My Face");
  });

  it("keeps a numeric title when the album is not numbered", () => {
    expect(
      titlesFor([
        "three./13 days.mp3",
        "three./electrohumm.mp3",
        "three./bendy wind.mp3",
      ]),
    ).toContain("13 Days");
  });

  it("only strips the leading number, not one inside the title", () => {
    expect(
      titlesFor([
        "hifiveyourself/06 baby parasite.mp3",
        "hifiveyourself/07 13 days.mp3",
        "hifiveyourself/08 better ask.mp3",
      ]),
    ).toEqual(["Baby Parasite", "13 Days", "Better Ask"]);
  });

  it("rejects malformed roman numerals", () => {
    expect(
      titlesFor([
        "x/iiii not a numeral.mp3",
        "x/vv also not one.mp3",
        "x/xx fine.mp3",
      ]),
    ).toContain("Iiii Not a Numeral");
  });

  it("groups tracks by album", () => {
    const catalog = deriveCatalog([
      "seemsreal/i one.mp3",
      "hifiveyourself/01 two.mp3",
    ]);
    expect(new Set(catalog.map((s) => s.album))).toEqual(
      new Set(["seemsreal", "hifiveyourself"]),
    );
  });
});
