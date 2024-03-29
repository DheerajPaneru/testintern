import React, { Component } from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            coords: { lat: 28.7041, lng: 77.1025 },
            address: ''
        };
    }

    handleChange = address => {
        console.log(address);
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address });
        geocodeByAddress(address).then(results => getLatLng(results[0])).then(latLng => {
            let str = address + "_" + latLng.lat + "_" + latLng.lng;
            let ecoded = window.btoa(str);
            sessionStorage.setItem('addressLocation', ecoded);
            this.setState({ coords: latLng })
        }).catch(error => console.error('Error', error));
    };

    handleToggleOpen = () => {
        this.setState({ isOpen: true });
    };

    handleToggleClose = () => {
        this.setState({ isOpen: false });
    };

  render() {

    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap defaultCenter={this.state.coords} defaultZoom={13}>
        <Marker
          key={this.props.index}
          position={this.state.coords}
          onClick={() => this.handleToggleOpen()}
        >
          {this.state.isOpen && (
            <InfoWindow
              onCloseClick={this.props.handleCloseCall}
              options={{ maxWidth: 100 }}
            >
              <span>This is InfoWindow message!</span>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    ));

    return (
      <div>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input'
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                      key={suggestion.placeId}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <GoogleMapExample
          containerElement={<div style={{ height: `465px`, width: '465px' }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default Map;
