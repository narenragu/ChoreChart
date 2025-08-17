import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Col, Row, Container, Card, Image } from "react-bootstrap";
import { db } from "../../firebase";

function ImageCard() {
  const [images, setImages] = useState();

  useEffect(() => {
    async function fetchImages() {
      const images = collection(db, "images");
      let imagesList = await getDocs(images);
      imagesList = imagesList.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setImages(imagesList);
    }

    fetchImages();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "images"), (images) => {
      images = images.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(images);
    });

    return () => unsub();
  }, []);

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
          {images && (
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
