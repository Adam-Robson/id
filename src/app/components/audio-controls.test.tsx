import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AudioPlayer from "@/app/components/audio-player";
import { AudioProvider } from "@/contexts/audio-provider";
import type { Song } from "@/types/song";

const songs: Song[] = [
  { key: "a", title: "Track A", album: "Album One", url: "a.mp3" },
  { key: "b", title: "Track B", album: "Album One", url: "b.mp3" },
];

function renderPlayer() {
  return render(
    <AudioProvider>
      <AudioPlayer songs={songs} />
    </AudioProvider>,
  );
}

describe("AudioControls", () => {
  it("renders the first track's title and album in the now-playing area", () => {
    renderPlayer();
    expect(
      screen.getByText("Track A", { selector: ".song-title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Album One", { selector: ".song-album" }),
    ).toBeInTheDocument();
  });

  it("advances to the next track when Next is clicked", async () => {
    const user = userEvent.setup();
    renderPlayer();
    await user.click(screen.getByRole("button", { name: "Next song" }));
    expect(
      screen.getByText("Track B", { selector: ".song-title" }),
    ).toBeInTheDocument();
  });

  it("wraps to the last track when Previous is clicked from the first", async () => {
    const user = userEvent.setup();
    renderPlayer();
    await user.click(screen.getByRole("button", { name: "Previous song" }));
    expect(
      screen.getByText("Track B", { selector: ".song-title" }),
    ).toBeInTheDocument();
  });

  it("toggles the track list open and closed via the Tracks button", async () => {
    const user = userEvent.setup();
    renderPlayer();
    await user.click(screen.getByRole("button", { name: "Open song list" }));
    expect(
      screen.getByRole("button", { name: "Close song list" }),
    ).toBeInTheDocument();
  });

  it("toggles play/pause and calls the HTMLMediaElement methods", async () => {
    const user = userEvent.setup();
    renderPlayer();
    const playBtn = screen.getByRole("button", { name: "Play" });
    await user.click(playBtn);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Pause" }),
    ).toBeInTheDocument();
  });
});

describe("AudioPlayer", () => {
  it("renders nothing when no songs are provided", () => {
    const { container } = render(
      <AudioProvider>
        <AudioPlayer songs={[]} />
      </AudioProvider>,
    );
    expect(container.querySelector(".audio-player")).toBeNull();
  });

  it("clicking a track in the list sets it as the current track", async () => {
    const user = userEvent.setup();
    renderPlayer();
    await user.click(screen.getByRole("button", { name: "Open song list" }));
    const trackBInList = screen
      .getAllByRole("button", { name: "Track B" })
      .find((el) => el.className.includes("audio-player-album-song"));
    if (!trackBInList) throw new Error("Track B list item not found");
    await user.click(trackBInList);
    expect(
      screen.getByText("Track B", { selector: ".song-title" }),
    ).toBeInTheDocument();
  });
});
