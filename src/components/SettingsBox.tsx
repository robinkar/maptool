import React, { useCallback, useState } from "react";

export default function SettingsBox(props: {
  showInfluence: boolean;
  showMinDist: boolean;
  showMaxDist: boolean;
  showTowerNames: boolean;
  showPreview: boolean;
  showLinks: boolean;
  alpha: number;
  setShowInfluence: Function;
  setShowMinDist: Function;
  setShowMaxDist: Function;
  setShowTowerNames: Function;
  setShowPreview: Function;
  setShowLinks: Function;
  setAlpha: Function;
}) {

  const onInfluenceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const state = e.currentTarget.checked;
      props.setShowInfluence(state);
    },
    [props]
  );

  const onMinDistChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const state = e.currentTarget.checked;
      props.setShowMinDist(state);
    },
    [props]
  );

  const onMaxDistChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const state = e.currentTarget.checked;
      props.setShowMaxDist(state);
    },
    [props]
  );

  const onTowerNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const state = e.currentTarget.checked;
      props.setShowTowerNames(state);
    },
    [props]
  );

  const onPreviewChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const state = e.currentTarget.checked;
      props.setShowPreview(state);
    },
    [props]
  );

  const onLinksChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const state = e.currentTarget.checked;
      props.setShowLinks(state);
    },
    [props]
  );

  const onAlphaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAlpha = Number(e.currentTarget.value);
      props.setAlpha(newAlpha / 100);
    },
    [props]
  );

  return (<div className="settings-container">
    <label>
      <input
        type="checkbox"
        checked={props.showInfluence}
        onChange={onInfluenceChange}
      />
    Show influence
  </label>
    <label>
      <input
        type="checkbox"
        checked={props.showMinDist}
        onChange={onMinDistChange}
      />
    Show minimum distance
  </label>
    <label>
      <input
        type="checkbox"
        checked={props.showMaxDist}
        onChange={onMaxDistChange}
      />
    Show maximum distance
  </label>
    <label>
      <input
        type="checkbox"
        checked={props.showTowerNames}
        onChange={onTowerNameChange}
      />
    Show tower names
  </label>
    <label>
      <input
        type="checkbox"
        checked={props.showPreview}
        onChange={onPreviewChange}
      />
    Show tower preview
  </label>
    <label>
      <input
        type="checkbox"
        checked={props.showLinks}
        onChange={onLinksChange}
      />
    Show tower links
  </label>
    <label>
      <input
        type="range"
        min="0"
        max="100"
        value={props.alpha * 100}
        onChange={onAlphaChange}
      />
    Tower radius alpha
  </label>
  </div>);
}
