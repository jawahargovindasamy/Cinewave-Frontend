import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Row, Col, Form } from "react-bootstrap";
import { FaSearch, FaSort } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const TVEpisodesList = ({ tvId }) => {
  const { apiCall, VIDURL, backendAPI, user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);


  /* ======================================================
     FETCH SERIES
  ====================================================== */
  useEffect(() => {
    const fetchSeries = async () => {
      const data = await apiCall(`/tv/${tvId}`);
      setSeries(data);
    };

    fetchSeries();
  }, [tvId, apiCall]);

  /* ======================================================
     URL → STATE SYNC (handles missing ?season)
  ====================================================== */
  useEffect(() => {
    if (!series?.seasons?.length) return;

    const seasonFromUrl = searchParams.get("season");
    const defaultSeason = series.seasons[0].season_number;

    const seasonToUse = seasonFromUrl || defaultSeason;

    if (seasonToUse !== selectedSeason) {
      setSelectedSeason(seasonToUse);
    }
  }, [searchParams, series]);

  /* ======================================================
     FETCH EPISODES
  ====================================================== */
  useEffect(() => {
    if (!selectedSeason) return;

    const fetchEpisodes = async () => {
      const seasonData = await apiCall(`/tv/${tvId}/season/${selectedSeason}`);
      setEpisodes(seasonData?.episodes || []);
    };

    fetchEpisodes();
  }, [selectedSeason, tvId, apiCall]);

  if (!series) return null;

  console.log(episodes);
  

  /* ======================================================
     FILTER + SORT
  ====================================================== */
  const filteredEpisodes = episodes
    .filter(
      (ep) =>
        ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ep.episode_number.toString().includes(searchTerm)
    )
    .sort((a, b) =>
      sortAsc
        ? a.episode_number - b.episode_number
        : b.episode_number - a.episode_number
    );

  /* ======================================================
     PLAY EPISODE
  ====================================================== */
  const playEpisode = async (season, episode) => {

    if (user) {

      try {
        await backendAPI.post("/continue-watching", {
          mediaId: tvId,
          mediaType : "tv",
          seasonNumber: Number(season),
          episodeNumber: Number(episode),
        });
      } catch (error) {
        console.error("Failed to update continue watching:", error);
      }
    }

    const url = `${VIDURL}/tv/${tvId}/${season}/${episode}?color=ff0000&autoPlay=true&nextEpisode=true&episodeSelector=true`;

    const allEpisodeNumbers = [...episodes]
      .sort((a, b) => a.episode_number - b.episode_number)
      .map((ep) => ep.episode_number);

    navigate(`/tv/${tvId}/season/${season}/episode/${episode}/play`, {
      state: {
        url,
        title: `${series.name} - S${season}E${episode}`,
        tvId,
        seriesName: series.name,
        seasonNumber: season,
        currentEpisodeNumber: episode,
        allEpisodeNumbers,
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-4 mt-4 card bg-dark text-white shadow-lg border-secondary">
      <div className="card-body">
        <h3 className="fw-bold border-start border-4 ps-3 mb-4">Episodes</h3>

        {/* Filters */}
        <div className="p-3 bg-secondary bg-opacity-25 rounded mb-4">
          <Row className="g-3 align-items-center">
            <Col xs={12} md={4}>
              <Form.Select
                value={selectedSeason}
                onChange={(e) => {
                  const season = e.target.value;

                  setSearchParams((prev) => {
                    prev.set("season", season);
                    return prev;
                  });
                }}
                className="bg-dark text-white border-secondary custom-input-height"
              >
                {series.seasons.map((s) => (
                  <option key={s.id} value={s.season_number}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={8}>
              <div className="d-flex gap-2">
                <div className="flex-grow-1 input-group custom-input-height">
                  <span className="input-group-text bg-dark text-white border-secondary">
                    <FaSearch size={14} />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search episode..."
                    className="bg-dark text-white border-secondary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-dark border-secondary text-white custom-input-height"
                  style={{ width: "48px" }}
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  <FaSort size={16} />
                </button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Episode List */}
        <div
          className={filteredEpisodes.length > 5 ? "episodes-scrollable" : ""}
          style={
            filteredEpisodes.length > 5
              ? { maxHeight: "400px", overflowY: "auto", paddingRight: "8px" }
              : {}
          }
        >
          {filteredEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="d-flex bg-secondary bg-opacity-25 p-3 rounded mb-3 episode-item"
              style={{ cursor: "pointer" }}
              onClick={() => playEpisode(selectedSeason, ep.episode_number)}
            >
              <img
                src={
                  ep.still_path
                    ? `https://image.tmdb.org/t/p/w200${ep.still_path}`
                    : "https://via.placeholder.com/100x60?text=No+Image"
                }
                className="rounded me-3"
                style={{ width: "120px", height: "70px", objectFit: "cover" }}
                alt={ep.name}
              />
              <div>
                <p className="fw-bold mb-1">
                  {ep.episode_number}. {ep.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVEpisodesList;
