import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Layer from 'grommet/components/Layer';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import AddIcon from 'grommet/components/icons/base/Add';
import Toast from 'grommet/components/Toast';
import Anchor from 'grommet/components/Anchor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import IterationIcon from 'grommet/components/icons/base/Iteration';
import MagicIcon from 'grommet/components/icons/base/Magic';
import PinIcon from 'grommet/components/icons/base/Pin';
import EventsList from '../components/EventsList';
import eventActions from '../../redux/actions/eventActions';
import loginActions from '../../redux/actions/loginActions';
import NewEventForm from '../components/NewEventForm';
import EditEventForm from '../components/EditEventForm';
import '../styles/events.scss';

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'All',
      showNewEventForm: false,
      showEditEventForm: false,
      editingEvent: null,
      calendar: null,
      showToast: true,
    };
    this.handleCalendarDate = this.handleCalendarDate.bind(this);
    this.displayEditEventForm = this.displayEditEventForm.bind(this);
  }

  componentDidMount() {
    this.props.loadEvents();
  }

  handleCalendarDate(date) {
    this.setState({
      calendar: date
    });
  }

  displayEditEventForm(event) {
    this.setState({
      showEditEventForm: true,
      editingEvent: event,
    });
  }

  render() {
    const status = this.props.status;
    const createEvent = this.props.createEvent;
    const deleteEvent = this.props.deleteEvent;
    const updateEvent = this.props.updateEvent;
    const isAuthenticated = this.props.isAuthenticated;
    const errMessage = this.props.errMessage;
    const editEvent = this.props.editEvent;

    // filter events based on what events view users choose
    let viewEvents;
    if (this.state.view === 'Created') {
      viewEvents = this.props.events.filter(e => e.username === isAuthenticated);
    } else if (this.state.view === 'Pinned') {
      viewEvents = this.props.events.filter(e =>
        JSON.stringify(e.pinned).includes(isAuthenticated));
    } else if (this.state.view === 'All') {
      viewEvents = this.props.events;
    }

    // filters events based on calendar
    let calendarFilteredEvents;
    if (this.state.calendar) {
      calendarFilteredEvents = viewEvents.filter(e =>
        e.date.split('T')[0].replace(/-/g, '') >= this.state.calendar.format().split('T')[0].replace(/-/g, ''));
    } else {
      calendarFilteredEvents = viewEvents;
    }

    // filter events based on search
    const events = calendarFilteredEvents.filter(e =>
      e.title.toLowerCase().includes(this.props.searchQuery.toLowerCase()) ||
      e.username.toLowerCase().includes(this.props.searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(this.props.searchQuery.toLowerCase()) ||
      JSON.stringify(e.location).toLowerCase().includes(this.props.searchQuery.toLowerCase()) ||
      JSON.stringify(e.topics).toLowerCase().includes(this.props.searchQuery.toLowerCase())
    );

    let toast = null;
    const todayDate = new Date();
    const formattedDate = moment(todayDate).format('YYYY-MM-DD');
    const pinReminders = this.props.events.filter((e) => {
      if (e.pinned !== undefined) {
        return JSON.stringify(e.pinned).includes(isAuthenticated);
      }
      return e;
    }
    ).filter(et =>
      et.date.slice(0, 10) === formattedDate);
    if (pinReminders.length > 0 && !this.props.reminder) {
      const reminders = [];
      pinReminders.forEach(pin => reminders.push(pin.title));
      toast = (<Toast status={'ok'} onClose={this.props.loginReminder}>
        {`Your pinned events happening today: ${reminders.join(', ')}`}
      </Toast>);
    }

    const zeroEvents = events.length > 0 ? null : (<h3>{`No ${this.state.view !== 'All' ? this.state.view : ''} Events`}</h3>);

    return (
      <div>
        <div className="banner-container">
          {toast}
          <Split priority={'left'} showOnResponsive={'both'} flex={'left'} fixed={false}>
            <Box pad={'small'} align={'start'} >
              {
                this.state.showNewEventForm &&
                <Layer
                  closer
                  flush
                  onClose={() => { this.setState({ showNewEventForm: false }); }}
                >
                  <NewEventForm
                    createEvent={createEvent}
                    onSubmit={() => { this.setState({ showNewEventForm: false }); }}
                    isAuthenticated={isAuthenticated}
                  />
                </Layer>
              }
              {
                this.state.showEditEventForm &&
                <Layer
                  closer
                  flush
                  onClose={() => { this.setState({ showEditEventForm: false }); }}
                >
                  <EditEventForm
                    event={this.props.editingEvent}
                    editEvent={editEvent}
                    editingEvent={this.state.editingEvent}
                    deleteEvent={deleteEvent}
                    onSubmit={() => { this.setState({ showEditEventForm: false }); }}
                    isAuthenticated={isAuthenticated}
                  />
                </Layer>
              }
              <div className="date-selector">
                <p className="date-label"><strong>Filter events by date:</strong></p>
                <DatePicker
                  todayButton="Today"
                  selected={this.state.calendar}
                  placeholderText="Select a date here"
                  onChange={this.handleCalendarDate}
                  isClearable
                />
              </div>
            </Box>
            <Box pad={'medium'} align={'end'} alignContent={'around'}>
              <div className="event-buttons">
                <Anchor
                  style={{ textDecoration: 'none' }}
                  label={<h3 className="allEventsButton"><IterationIcon />{'All'}</h3>}
                  disabled={this.state.view === 'All'}
                  onClick={() => this.setState({ view: 'All' })}
                />
                <Anchor
                  style={{ textDecoration: 'none' }}
                  label={<h3 className="myEventsButton">{'  '}<MagicIcon />{'My Events'}</h3>}
                  disabled={this.state.view === 'Created'}
                  onClick={() => this.setState({ view: 'Created' })}
                />
                <Anchor
                  style={{ textDecoration: 'none' }}
                  label={<h3 className="myPinnedButton"><PinIcon />{'My Pinned'}</h3>}
                  disabled={this.state.view === 'Pinned'}
                  onClick={() => this.setState({ view: 'Pinned' })}
                />
                <br />
              </div>
              <div className="add-event">
                <Anchor
                  style={{ textDecoration: 'none' }}
                  label={<h3 className="addEventButton"><AddIcon />{'Add Event'}</h3>}
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ showNewEventForm: true });
                  }}
                />
              </div>
            </Box>
          </Split>
        </div>
        <div>
          {zeroEvents}
          <EventsList
            events={events}
            status={status}
            updateEvent={updateEvent}
            displayEditEventForm={this.displayEditEventForm}
            isAuthenticated={isAuthenticated}
            errMessage={errMessage ? 'error somewhere' : ''}
            map={false}
          />
        </div>
      </div>
    );
  }
}

Events.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.string.isRequired,
  createEvent: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  editingEvent: PropTypes.func,
  loadEvents: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  loginReminder: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  errMessage: PropTypes.string,
  reminder: PropTypes.bool.isRequired,
};

Events.defaultProps = {
  errMessage: '',
  editingEvent: PropTypes.func,
};

const mapStateToProps = state => ({
  events: state.events.events,
  searchQuery: state.search.searchQuery,
  status: state.events.status,
  isAuthenticated: state.auth.isAuthenticated,
  errMessage: state.events.error,
  reminder: state.auth.reminder,
});

const mapDispatchToProps = dispatch => ({
  createEvent: url => dispatch(eventActions.postEventAsync(url)),
  loadEvents: url => dispatch(eventActions.loadEventsAsync(url)),
  deleteEvent: id => dispatch(eventActions.deleteEventAsync(id)),
  updateEvent: eventObj => dispatch(eventActions.updateEventsAsync(eventObj)),
  editEvent: url => dispatch(eventActions.editEventAsync(url)),
  loginReminder: () => dispatch(loginActions.loginReminder()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Events));
