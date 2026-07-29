import { sharedOgImage } from "@/app/components/shared-metadata";

export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": "https://lefog.xyz/#artist",
        name: "LE FOG",
        url: "https://lefog.xyz",
        image: sharedOgImage,
        genre: ["Electronic", "Ambient", "Rock", "Folk", "Psychedelic"],
        foundingLocation: {
          "@type": "Place",
          name: "Portland, Oregon, US",
        },
        album: [
          { "@id": "https://lefog.xyz/#forbeforeiforget" },
          { "@id": "https://lefog.xyz/#hifiveyourself" },
          { "@id": "https://lefog.xyz/#leftstaticandatease" },
          { "@id": "https://lefog.xyz/#seemsreal" },
          { "@id": "https://lefog.xyz/#three" },
        ],
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.xyz/#forbeforeiforget",
        name: "forbeforeiforget",
        byArtist: { "@id": "https://lefog.xyz/#artist" },
        numTracks: 12,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.xyz/#hifiveyourself",
        name: "hifiveyourself",
        byArtist: { "@id": "https://lefog.xyz/#artist" },
        numTracks: 9,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.xyz/#leftstaticandatease",
        name: "leftstaticandatease",
        byArtist: { "@id": "https://lefog.xyz/#artist" },
        numTracks: 12,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.xyz/#seemsreal",
        name: "seemsreal",
        byArtist: { "@id": "https://lefog.xyz/#artist" },
        numTracks: 10,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.xyz/#three",
        name: "three.",
        byArtist: { "@id": "https://lefog.xyz/#artist" },
        numTracks: 12,
      },
    ],
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(jsonLd).replace(/</g, "\\u003c")}
    </script>
  );
}
