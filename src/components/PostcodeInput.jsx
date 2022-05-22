export const PostcodeInput = ({
  handleSubmit,
  inputValue,
  handleChange,
  error,
  getGeolocation,
}) => {
  return (
    <div>
      <form action="submit" onSubmit={handleSubmit}>
        {"geolocation" in navigator ? (
          <button onClick={getGeolocation}>Geolocate</button>
        ) : null}
        <input
          type="text"
          placeholder="Enter postcode"
          value={inputValue}
          onChange={handleChange}
        />
        <br />
        <br />
        <button>Find Dentists</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
