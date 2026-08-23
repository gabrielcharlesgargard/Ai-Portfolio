import React from "react";
import { communityPageStyles as s } from "../assets/dummyStyles";
import Navbar from "../Components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommunity } from "../utils/api";
import { Card, ProjectThumbnail } from "../assets/ui";
import { Calendar, Check, ExternalLink, Eye, Heart, Loader2 } from "lucide-react";
import Footer from "../Components/Footer";

const filters = [
  { label: "New", key: "new" },
  { label: "Most viewed", key: "views" },
  { label: "Most loved", key: "likes" },
];

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);
  const [sort, setSort] = useState("new");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load community projects acoording to the sort

  useEffect(() => {
    setLoading(true);
    setError("");
    getCommunity(sort)
      .then((data) => {
        setProjects(data.projects);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sort]);

  //   to like or to dislike a project
  async function like(id) {
    const prev = projects;
    setProjects((old) =>
      old.map((p) =>
        p.id === id
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: Math.max(0, (p.likes || 0) + (p.likedByMe ? -1 : 1)),
            }
          : p,
      ),
    );

    try {
      const data = await likeCommunityProject(id);
      setProjects((old) =>
        old.map((p) =>
          p.id === id
            ? {
                ...p,
                likes: data.likes,
                likedByMe: data.liked,
              }
            : p,
        ),
      );
    } catch {
      setProjects(prev);
    }
  }

  return (
    <div className={s.container}>
      <Navbar />

      <section className={s.heroWrapper}>
        <div className={s.heroBg} style={s.heroBgStyle}></div>
        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>Published Projects</h1>
          <p className={s.heroSub}>
            Real projects published by the Ai-Protfolio community. Click open to
            view it live, or tap the heart to show some love.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className={s.filterBar}>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setSort(f.key)}
                className={`${s.filterButtonBase} ${sort === f.key ? s.filterButtonActive : s.filterButtonInactive}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <Card className={`${s.cardMessage} ${s.loadingText}`}>
              <Loader2 className={s.loadingSpinner} />
              Loading community projects...
            </Card>
          ) : error ? (
            <Card className={`${s.cardMessage} ${s.errorText}`}>
              Couldn't load community projects. Please try again later.
              <span className="block mt-2 text-sm">{error}</span>
            </Card>
          ) : projects.length === 0 ? (
            <Card className={`${s.cardMessage} ${s.emptyText}`}>
              No projects found. Be the first - create one and hit{" "}
              <span className={s.emptyHighlight}>Publish</span>
            </Card>
          ) : (
            <div className={s.grid}>
              {projects.map((p) => (
                <CommunityCard key={p._id || p.id} project={p} isLoggedIn={Boolean(user)} 
                onOpen={() => navigate(`/projects/${p.id}`)}
                onLike={() => {
                    if(!user) {
                        navigate("/login");
                        return;
                    }
                    like(p.id);
                }}
                />

              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommunityPage;




function CommunityCard({ project, isLoggedIn, onOpen, onLike }) {
  const initial = (project.author || "A").charAt(0).toUpperCase();
  const date = project.publishedAt
    ? new Date(project.publishedAt).toLocaleDateString()
    : "";
  const likedByMe = Boolean(project.likedByMe);

  return (
    <Card hover className={s.card}>
      <button
        type="button"
        onClick={onOpen}
        className={s.thumbnailWrapper}
      >
        <ProjectThumbnail html={project.html} />
        <span className={s.websiteTag}>Website</span>
        {project.isOwn && (
          <span className={s.ownBadge}>
            <Check className={s.ownBadgeIcon} strokeWidth={3} />
            Published by you
          </span>
        )}
      </button>

      <div className={s.cardBody}>
        {project.isOwn && (
          <div className={s.ownIndicator}>
            <span className={s.ownDot} />
            Your project — live in community
          </div>
        )}
        <h3 className={s.projectTitle}>{project.name}</h3>

        <div className={s.actionRow}>
          <button
            onClick={onOpen}
            className={s.openButton}
          >
            <ExternalLink className={s.iconSm} /> Open
          </button>
          <button
            onClick={onLike}
            disabled={project.isOwn}
            title={
              project.isOwn
                ? "You can't like your own project"
                : likedByMe
                  ? "Unlike"
                  : isLoggedIn
                    ? "Like"
                    : "Sign in to like"
            }
            className={`${s.likeButtonBase} ${
              likedByMe ? s.likeButtonLiked : s.likeButtonUnliked
            } ${project.isOwn ? s.likeButtonOwn : ""}`}
          >
            <Heart
              className={`${s.likeIcon} ${
                likedByMe ? s.likeIconFilled : ""
              }`}
            />
            {project.likes ?? 0}
          </button>
        </div>

        <div className={s.footerRow}>
          <div className={s.authorInfo}>
            <div className={s.authorAvatar}>{initial}</div>
            <span className={s.authorName}>
              {project.author || "Anonymous"}
            </span>
          </div>
          <div className={s.metaGroup}>
            {date && (
              <span className={s.metaItem}>
                <Calendar className={s.iconXs} /> {date}
              </span>
            )}
            <span className={s.metaItem}>
              <Eye className={s.iconXs} /> {project.views ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
