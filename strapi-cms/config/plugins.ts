export default () => ({
  // Upload configuration
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
      // Enable sharp image processing
      sizeOptimization: true,
      responsiveDimensions: true,
      // Disable autoOrientation to preserve manually rotated images
      // If you rotate images in an editor, they should stay as you saved them
      autoOrientation: false,
    },
  },
});
