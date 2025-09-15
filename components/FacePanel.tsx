/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import type { Detection } from '@mediapipe/tasks-vision';
import { FaceSmileIcon } from './icons';

interface FacePanelProps {
  faces: Detection[];
  onSelectFace: (index: number) => void;
  isLoading: boolean;
}

const FacePanel: React.FC<FacePanelProps> = ({ faces, onSelectFace, isLoading }) => {
  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <FaceSmileIcon className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-300">Face Detection</h3>
      </div>
      
      {isLoading ? (
        <p className="text-gray-400">Detecting faces...</p>
      ) : (
        <>
          <p className="text-md text-center text-gray-400">
            {faces.length > 0
              ? `${faces.length} face${faces.length > 1 ? 's' : ''} detected. Click a face on the image or select one below to start editing.`
              : 'No faces were detected in this image.'}
          </p>
          {faces.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {faces.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onSelectFace(index)}
                  className="bg-white/10 hover:bg-white/20 text-gray-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 active:scale-95"
                >
                  Edit Face {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacePanel;