import React from 'react';

export default function XButton({pressX}: { pressX: () => void }) {
  return (
    <button className="popup-close-btn stylenone-ico-btn" onClick={pressX}>
      <i className="fal fa-times"></i>
    </button>
  );
}
