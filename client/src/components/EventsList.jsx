import React from 'react';
import PropTypes from 'prop-types';
import Card from 'grommet/components/Card';
import Tile from 'grommet/components/Tile';
import Tiles from 'grommet/components/Tiles';
import Anchor from 'grommet/components/Anchor';
import Paragraph from 'grommet/components/Paragraph';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import Heading from 'grommet/components/Heading';
import Timestamp from 'grommet/components/Timestamp';
import Spinning from 'grommet/components/icons/Spinning';

const EventsList = ({ events, status, deleteEvent }) => (<div>
  {status === 'LOADING' && <p className="loading">Loading ...<Spinning /></p>}
  {status === 'ERROR' && <p className="error">Error loading or posting events ...</p>}
  {
    <Tiles fill flush={false}>
      {events.map(evt =>
        (<Tile key={evt._id} align={'start'}>
          <Card
            label={evt.username ? <span>Created by <a href={`/profile/${evt.username}`}>{evt.username}</a></span> : undefined}
            heading={evt.title}
            description={
              <Accordion>
                <AccordionPanel heading={`Topics: ${evt.topics.join(', ')}`}>
                  <Paragraph>
                    {evt.description || 'No description provided for this event'}
                  </Paragraph>
                  <Heading tag={'h3'}>Topics</Heading>
                  <Paragraph>
                    {evt.topics ? evt.topics.join(', ') : 'No topics provided for this event'}
                  </Paragraph>
                  <Heading tag={'h3'}>When?</Heading>
                  <Paragraph>
                    {<Timestamp value={evt.date} /> || 'No date provided for this event'}
                  </Paragraph>
                  <Heading tag={'h3'}>Where?</Heading>
                  <Paragraph>
                    {evt.location || 'No locationg provided for this event'}
                  </Paragraph>
                  <Heading tag={'h3'}>Estimated Duration</Heading>
                  <Paragraph>
                    {evt.duration || 'No duration provided for this event'}
                  </Paragraph>
                </AccordionPanel>
              </Accordion>}
            link={<Anchor
              onClick={(e) => {
                e.preventDefault();
                deleteEvent(evt._id);
              }}
              label={'delete this event'}
            />}
          />
        </Tile>)
      )}
    </Tiles>
  }
</div>);

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.string.isRequired,
  deleteEvent: PropTypes.func.isRequired,
};

export default EventsList;
