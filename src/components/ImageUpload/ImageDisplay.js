import React from 'react';
import { Card, Image, Text, Flex, Heading } from '@aws-amplify/ui-react';
import '../styles/ImageDisplay.css';

const ImageDisplay = ({ uploadedImage, relatedImages }) => {
  return (
    <div className="image-display-container mt-6">
      {/* Display the uploaded image */}
      <Heading level={3}>Uploaded Image</Heading>
      <div className="uploaded-image">
        <Image src={uploadedImage} alt="Uploaded" style={{ maxWidth: '500px', width: '100%' }} />
      </div>

      {/* Display related images as cards */}
      <Heading level={3}>Related Images</Heading>
      <Flex direction="row" wrap="wrap" justifyContent="center" gap="20px">
        {relatedImages && relatedImages.length > 0 ? (
          relatedImages.map((image, index) => (
            <Card key={index} padding="medium" backgroundColor="#f0f0f0" width="150px" height="150px" borderRadius="10px">
              <Image src={image} alt={`Related ${index}`} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </Card>
          ))
        ) : (
          <Text>No related images found.</Text>
        )}
      </Flex>
    </div>
  );
};

export default ImageDisplay;
