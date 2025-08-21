import { useEffect, useState } from "react";
import { Card, Image } from "react-bootstrap";

function ImageCard(props) {
  const { images = [] } = props;

  return (
    <>
      <Card className="h-100 w-100">
        {/* <Card.Header>
          <h3>Image</h3>
        </Card.Header> */}
        <Card.Body
          className="d-flex justify-content-center align-items-center"
          style={{ height: "calc(100% - 56px)" }} // subtract header height
        >
          {images && images.length > 0 && (
            <Image
              src={`${images[0].data}`}
              rounded
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              fluid
            />
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default ImageCard;
