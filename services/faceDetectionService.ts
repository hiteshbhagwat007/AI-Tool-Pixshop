/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FaceDetector, FilesetResolver, Detection } from "@mediapipe/tasks-vision";

let faceDetector: FaceDetector | null = null;
let isInitializing = false;
let initializationPromise: Promise<FaceDetector> | null = null;

// Initialize the FaceDetector, ensuring it only runs once.
export const initializeFaceDetector = async (): Promise<FaceDetector> => {
    if (faceDetector) {
        return faceDetector;
    }
    
    // If initialization is already in progress, return the existing promise
    if (isInitializing && initializationPromise) {
        return initializationPromise;
    }

    isInitializing = true;
    initializationPromise = new Promise(async (resolve, reject) => {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
            );
            const detector = await FaceDetector.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
                    delegate: "GPU"
                },
                runningMode: "IMAGE"
            });
            console.log("FaceDetector initialized successfully.");
            faceDetector = detector;
            isInitializing = false;
            resolve(detector);
        } catch (error) {
            console.error("Error initializing FaceDetector:", error);
            isInitializing = false;
            initializationPromise = null;
            reject(error);
        }
    });

    return initializationPromise;
};

/**
 * Detects faces in a given HTMLImageElement.
 * @param imageElement The image element to detect faces in.
 * @returns A promise that resolves to an array of detected faces.
 */
export const detectFaces = async (imageElement: HTMLImageElement): Promise<Detection[]> => {
    const detector = await initializeFaceDetector();
    if (!detector) {
        console.error("FaceDetector is not initialized.");
        return [];
    }
    
    // Ensure the image is fully decoded and ready for processing.
    await imageElement.decode();
    
    const result = detector.detect(imageElement);
    return result.detections;
};
