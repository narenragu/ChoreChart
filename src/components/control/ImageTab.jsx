import { Button, Form, InputGroup } from "react-bootstrap";
import ImageCard from "../display/ImageCard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import imageCompression from "browser-image-compression";

export default function ImageTab() {
  async function handleImage(e) {
    e.preventDefault();

    const file = e.target[0]?.files?.[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.25,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);
    const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

    updateImage(base64);
  }

  async function updateImage(base64String) {
    try {
      const imageRef = doc(db, "images", "image1"); // collection "images", doc "image1"
      await updateDoc(imageRef, { data: base64String });
      console.log("Image updated successfully!");
    } catch (err) {
      console.error("Error updating image:", err);
    }
  }

  return (
    <>
      <div style={{ height: "50vh" }}>
        <ImageCard></ImageCard>
      </div>
      <div className="d-flex justify-content-center">
        <Form onSubmit={(e) => handleImage(e)}>
          <Form.Group>
            <InputGroup>
              <Form.Control type="file" accept="image/*" />
              <Button type="submit">Upload</Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
