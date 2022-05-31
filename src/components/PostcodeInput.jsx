export const PostcodeInput = ({
  handleSubmit,
  inputValue,
  handleChange,
  error,
  searching,
  getGeolocation,
}) => {
  return (
    <div>
      <form action="submit" onSubmit={handleSubmit}>
        {"geolocation" in navigator ? (
          <a onClick={getGeolocation} className="btn btn-geolocate">
            <i className="fa-solid fa-location-crosshairs"></i>
          </a>
        ) : null}
        <input
          type="text"
          placeholder="Enter postcode"
          value={inputValue}
          onChange={handleChange}
          className="input-postcode"
        />
        <button disabled={searching} className="btn btn-find">
          {searching ? "Searching..." : "Find Dentists"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
