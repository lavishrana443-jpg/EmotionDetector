# EmotionDetector Model Notes

## Model used

EmotionDetector uses `@vladmandic/face-api` with two browser models:

1. **Tiny Face Detector** locates face rectangles efficiently enough for real-time browser use.
2. **Face Expression Net** estimates seven visible-expression probabilities for each detected face.

The expression classes exposed by the library are:

- Neutral
- Happy
- Sad
- Angry
- Fearful
- Disgusted
- Surprised

## Dataset and provenance

The upstream browser package documents the seven-class expression taxonomy but does not provide a complete named dataset and reproducible training recipe for the distributed expression weights. EmotionDetector intentionally does not invent a dataset attribution. The classes are FER-style, but this repository does not claim that the shipped weights were trained on FER-2013.

For a scientific or regulated use case, obtain a model with an explicit dataset card, demographic evaluation, and reproducible training details instead.

## Preprocessing and inference

- The camera supplies frames through a local HTML video element.
- The detector resizes the input to a small browser-friendly tensor.
- Tiny Face Detector finds one or more face boxes.
- Face Expression Net evaluates each face crop.
- The resulting probability object is rendered directly in the UI.
- The largest probability is shown as the current expression and the full distribution is shown as the analysis.

No frame is sent to an application server. No predictions are synthesized or randomized. If the model cannot load or inference fails, the app presents an error state.

## Performance

Inference runs on a controlled animation loop instead of on React render. The loop throttles work to a browser/device-appropriate cadence, measures processing duration and FPS from actual timestamps, and stops when detection is paused or the camera is stopped.

Multiple faces are supported by the detector. More faces and larger video inputs increase work, so throughput can drop on mobile devices.

## Limitations

Facial-expression recognition estimates visible appearance, not a person's internal emotional state. It can be affected by lighting, camera quality, face angle, occlusion, expression ambiguity, and differences between training data and the user population. Confidence is a model probability, not a correctness guarantee.

The model should not be used for medical, psychological, hiring, school, law-enforcement, or other high-impact decisions.

## Licensing

The application code is MIT licensed. `@vladmandic/face-api` and its model assets remain subject to their upstream licenses. Keep upstream notices intact when packaging or redistributing those assets.