import * as React from "react";
import * as PropTypes from "prop-types";
import ServiceDisplay from "./ServiceDisplay";
import Grid from "react-bootstrap/es/Grid";
import Col from "react-bootstrap/es/Col";
import Row from "react-bootstrap/es/Row";

class StackDisplay extends React.Component {
  render() {
    const { stackName, services } = this.props;
    return (
      <div className={"stack-display"}>
        <h3>{ stackName }</h3>

        <Grid fluid className={"container-striped"}>
          <Row className={"row-header"}>
            <Col sm={3}>Component</Col>
            <Col sm={2}>JIRA Issue</Col>
            <Col sm={2}>Replicas</Col>
            <Col sm={3}>Container Image</Col>
          </Row>

          {
            services
              .sort((a, b) => a.labels["deployment.name"] < b.labels["deployment.name"] ? -1 : 1)
              .map((service) => <ServiceDisplay key={service.id} service={service}/>)
          }
        </Grid>
      </div>
    );
  }
}

StackDisplay.propTypes = {
  stackName : PropTypes.string.isRequired,
  services : PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StackDisplay;
