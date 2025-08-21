import { useState, useEffect } from "react";
import { Card, Carousel } from "react-bootstrap";
import Counter from "./Counter";

function CounterCard(props) {
  const { userData, counters = [] } = props;

  return (
    <>
      <Card className="h-100 w-100">
        <Card.Header>
          <h3>Counters</h3>
        </Card.Header>
        <Card.Body>
          <Carousel controls={false}>
            {counters.map((counter) => (
              <Carousel.Item key={counter.id}>
                <Counter {...counter} userData={userData} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Card.Body>
      </Card>
    </>
  );
}

export default CounterCard;
