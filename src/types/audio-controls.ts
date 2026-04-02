export interface AudioControlsProps {
  onToggleList: () => void;
  listOpen: boolean;
  onPrev: () => void;
  onNext: () => void;
  minimized: boolean;
  onExpand: () => void;
}
