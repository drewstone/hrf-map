import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const CardWrapper = styled(Card)`
`;

function Popup(props) {
  return (
		<CardWrapper style={{ width: '14rem' }}>
			<Card.Body>
				<Card.Title>{`${props.country}`}</Card.Title>
				<Card.Text>
					<b>Population: </b>{`${props.population}`}
				</Card.Text>
				<Card.Text>
					<b>Regime Type: </b>{`${props.regimeType}`}
				</Card.Text>
			</Card.Body>
		</CardWrapper>
  );
}

export default Popup;