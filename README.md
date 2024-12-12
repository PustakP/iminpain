# Image Inpainting Widget Demo for Internship

## How to run

1. Clone the repository
2. Run `npm install --legacy-peer-deps` (because of the react-canvas-draw library)
3. Run `npm run dev`
4. Open the browser and go to `http://localhost:5173/`

## How to use

1. Click on the "Click or drag and drop" button to upload an image
2. Draw on the image to create a mask

## Code explanation

- `src/imgmask.jsx`: This is the main component that contains the image inpainting widget. It uses the `react-canvas-draw` library to draw on the image.
- `src/App.jsx`: This is the main entry point of the application. It renders the `ImageInpaintingWidget` component.
- `src/index.css`: This is the CSS file for the application.
- `src/main.jsx`: This is the entry point of the application. It renders the `App` component.

## Deployment

### Visit the website

- Visit the website at [https://imagepipelinesubmission.vercel.app/](https://imagepipelinesubmission.vercel.app/)

