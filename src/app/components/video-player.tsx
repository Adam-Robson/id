export default function VideoPlayer() {
  return (
    <div className="player">
      <video controls>
        <source src="/video/juggle.mp4" type="video/mp4" />
        <source src="/video/juggle.webm" type="video/webm" />
        <track kind="captions" />
      </video>

      <div className="controls">
        <button data-icon="p" className="play" type="button">
          Play
        </button>

        <button data-icon="s" className="stop" type="button">
          Stop
        </button>
        <div className="timer">
          <div></div>
          <span>00:00</span>
        </div>

        <button
          type="button"
          className="rwd"
          data-icon="b"
          aria-label="rewind"
        ></button>
        <button
          type="button"
          className="fwd"
          data-icon="fa"
          aria-label="fast forward"
        ></button>
      </div>
    </div>
  );
}
