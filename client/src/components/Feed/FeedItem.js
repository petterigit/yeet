import React from "react";
import { Grid, Divider, Label, Card, Icon, Button } from "semantic-ui-react";
import axios from "axios";

export default class FeedItem extends React.Component {
  liked() {
    const id = this.props.id;
    console.log("Liked", id);
    const data = {
      _id: id,
      like: true
    };
    axios
      .post("/match/like", data)
      .then(res => console.log("sent liked", res))
      .catch(err => console.log(err));
  }

  notLiked() {
    const id = this.props.id;
    console.log("Not liked", id);
    const data = {
      _id: id,
      like: false
    };
    axios
      .post("/match/like", data)
      .then(res => console.log("sent not liked", res))
      .catch(err => console.log(err));
  }

  render() {
    const gameItems = this.props.games.map(game => {
      return <Label size="huge"> {game + " "}</Label>;
    });

    return (
      <Card>
        <Card.Content>
          <Card.Header>{gameItems}</Card.Header>

          <Card.Description>{this.props.description}</Card.Description>
        </Card.Content>
        <Card.Content>
          <Icon name="user" />
          {this.props.username}
        </Card.Content>
        <Button.Group attached="bottom" size="big">
          <Button icon="thumbs up" color="green" onClick={() => this.liked()} />
          <Button
            icon="thumbs down"
            color="red"
            onClick={() => this.notLiked()}
          />
        </Button.Group>
      </Card>
    );
  }
}
