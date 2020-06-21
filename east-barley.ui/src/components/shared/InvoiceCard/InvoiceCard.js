/* eslint-disable no-else-return */
import React from 'react';
import { Card, Label, Icon, Grid, Button } from 'semantic-ui-react';
import './InvoiceCard.scss';

class InvoiceCard extends React.Component {
  formatDate = (date) => {
    const month = new Date(`${date}`).getMonth() + 1;
    const day = new Date(`${date}`).getDate();
    const year = new Date(`${date}`).getFullYear();
    const fullDate = `${month}` + '/' + `${day}` + '/' + `${year}`;
    return fullDate;
  };

  getStatus = (statusId) => {
    if (statusId === 1) {
      return <Label as='a' color='yellow' ribbon>
            Open Cart
      </Label>;
    } else if (statusId === 2) {
      return <Label as='a' color='teal' ribbon>
            Received
      </Label>;
    } else if (statusId === 3) {
      return <Label as='a' color='orange' ribbon>
            Completed
      </Label>;
    } else if (statusId === 4) {
      return <Label as='a' color='blue' ribbon>
            Shipped
      </Label>;
    }
  }

  shipStatus = (statusId) => {
    const { invoice } = this.props;
    if (statusId === 1) {
      return 'Go view items saved in your cart'
    } else if (statusId === 2) {
      return `Shipping To: ${invoice.billingAddress}, ${invoice.billingCity}, ${invoice.billingState} ${invoice.billingZip}`;
    } else {
      return `Shipped To: ${invoice.billingAddress}, ${invoice.billingCity}, ${invoice.billingState} ${invoice.billingZip}`;
    }
  }

  render() {
    const { invoice } = this.props;
    return (
      <div className="invoiceCardContainer">
        <Grid.Column>
          <Card className="invoiceCard" onClick={() => alert('to be done later')}>
            {this.getStatus(invoice.statusId)}
              <Card.Content header={`$${invoice.totalCost}`} />
              <Card.Content description={this.shipStatus(invoice.statusId)} />
              <Card.Content extra className="extraDetails">
                <Icon name='calendar alternate outline' />{this.formatDate(invoice.invoiceDate)}
              </Card.Content>
            </Card>
        </Grid.Column>
      </div>
    );
  }
}

export default InvoiceCard;
