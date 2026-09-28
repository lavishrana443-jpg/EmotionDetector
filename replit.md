# EmotionDetector

EmotionDetector estimates visible facial expressions locally in the browser using an open-source face detection and expression model.

## Run & Operate

- `pnpm --filter @workspace/emotion-detector run dev` — run the browser app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + TypeScript + Vite
- Inference: `@vladmandic/face-api` in the browser
- Styling: Tailwind CSS
- Deployment: static hosting, including Render

## Where things live

- `artifacts/emotion-detector/src/` — application UI, camera lifecycle, model loading, and inference loop
- `README.md` — setup, privacy, deployment, and limitations
- `MODEL.md` — model architecture, provenance caveat, inference, and licensing
- `render.yaml` — Render Static Site configuration

## Architecture decisions

- Webcam inference is browser-only so camera frames never need to cross an application server.
- The model's actual probabilities and measured performance metrics are rendered; no fallback predictions are synthesized.
- Model loading failures remain visible to the user rather than silently switching to a demo state.

## Product

The app provides a polished landing surface and a responsive detection workspace with camera controls, multiple-face boxes, actual expression probabilities, measured FPS/processing time, and in-memory history.

## User preferences

The user requested a completely free, open-source, no-API-key implementation with no authentication or database.

## Gotchas

- Camera access requires a secure browser context and user permission.
- The app's model assets are loaded from the upstream public model distribution at runtime.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
