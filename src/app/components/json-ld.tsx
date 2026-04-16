export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "MusicGroup",
      "@id": 'https://lefog.me/#artist',
      name: "LE FOG",
        url: "https://lefog.me",
        image: "https://lefog.me/images/og-image.jpg",
        genre: ["Electronic", "Ambient", "Rock", "Folk", "Psychedelic"],
        foundingLocation: {
          "@type": "Place",
          name: "Portland, Oregon, US",
        },
         album: [
          { "@id": "https://lefog.me/#forbeforeiforget" },
          { "@id": "https://lefog.me/#hifiveyourself" },
          { "@id": "https://lefog.me/#leftstaticandatease" },
          { "@id": "https://lefog.me/#seemsreal" },
          { "@id": "https://lefog.me/#three" },
        ],
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.me/#forbeforeiforget",
        name: "forbeforeiforget",
        byArtist: { "@id": "https://lefog.me/#artist" },
        numTracks: 12,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.me/#hifiveyourself",
        name: "hifiveyourself",
        byArtist: { "@id": "https://lefog.me/#artist" },
        numTracks: 9,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.me/#leftstaticandatease",
        name: "leftstaticandatease",
        byArtist: { "@id": "https://lefog.me/#artist" },
        numTracks: 12,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.me/#seemsreal",
        name: "seemsreal",
        byArtist: { "@id": "https://lefog.me/#artist" },
        numTracks: 10,
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://lefog.me/#three",
        name: "three.",
        byArtist: { "@id": "https://lefog.me/#artist" },
        numTracks: 12,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
