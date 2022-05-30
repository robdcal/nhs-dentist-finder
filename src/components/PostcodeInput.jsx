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
      {"geolocation" in navigator ? (
        <button onClick={getGeolocation}>Geolocate</button>
      ) : null}
      <form action="submit" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter postcode"
          value={inputValue}
          onChange={handleChange}
        />
        <br />
        <br />
        <button disabled={searching}>
          {searching ? "Searching..." : "Find Dentists"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
