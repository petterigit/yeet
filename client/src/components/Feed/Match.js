import React from "react";
import { Label, Card, Header, Icon, Button } from "semantic-ui-react";

export default class Match extends React.Component {
  state = {
    matched: false
  };

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Header size="huge">
            <Icon name="user" />
            <Header.Content>{this.props.username}</Header.Content>
          </Header>
          You share interest in these games:
          <Label.Group size="big">
            {this.props.games.map(game => {
              return <Label> {game}</Label>;
            })}
          </Label.Group>
          <Card.Description>{this.props.description}</Card.Description>
        </Card.Content>

        <Button.Group attached="bottom" size="big">
          {/* Nimi vasemmalle, Buttonit oikealle */}
          <Button positive>Accept</Button>
          <Button negative>Decline</Button>
        </Button.Group>
      </Card>
    );
  }
}
