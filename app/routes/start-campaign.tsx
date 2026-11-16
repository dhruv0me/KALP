import {
  IconArrowUpRight,
  IconBookmark,
  IconCheck,
  IconPlant2,
  IconRocket,
  IconShieldLock,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  useCreateCampaign,
  useMyCampaigns,
  useUpdateCampaign,
} from "@/hooks/use-campaigns";
import { useSession } from "@/hooks/use-session";
import {
  CREATE_CAMPAIGN_CATEGORIES,
  type CreateCampaignCategory,
  formatCampaignAmount,
} from "@/lib/campaigns";

export function meta() {
  return [{ title: "kalpa" }];
}

export default function StartCampaignRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authenticated, email, isLoading: sessionLoading } = useSession();

  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const {
    created,
    saved,
    isLoading: myLoading,
    refetch: refetchMine,
  } = useMyCampaigns(authenticated);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CreateCampaignCategory>(
    CREATE_CAMPAIGN_CATEGORIES[0],
  );
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [institution, setInstitution] = useState("");
  const [studentId, setStudentId] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [proofTitle, setProofTitle] = useState("");
  const [proofSummary, setProofSummary] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !authenticated) {
      navigate(`/auth?return=${encodeURIComponent("/start-campaign")}`, {
        replace: true,
      });
    }
  }, [authenticated, navigate, sessionLoading]);

  const handleSubmit = async (submitStatus: "active" | "draft") => {
    setFormError(null);
    setSuccessNotice(null);

    if (title.trim().length < 3) {
      setFormError("Campaign title must be at least 3 characters.");
      return;
    }
    if (country.trim().length < 2) {
      setFormError("Please enter a valid country.");
      return;
    }
    if (description.trim().length < 10) {
      setFormError("Please provide a description of at least 10 characters.");
      return;
    }

    const parsedTarget = targetAmount.trim()
      ? Number.parseInt(targetAmount.trim(), 10)
      : undefined;
    if (
      targetAmount.trim() &&
      (!Number.isFinite(parsedTarget) || (parsedTarget ?? 0) <= 0)
    ) {
      setFormError("Fundraising target must be a positive whole number.");
      return;
    }

    if ((docTitle.trim() && !docUrl.trim()) || (!docTitle.trim() && docUrl.trim())) {
      setFormError(
        "To attach an initial restricted document, provide both its title and URL.",
      );
      return;
    }

    if (
      (proofTitle.trim() && !proofSummary.trim()) ||
      (!proofTitle.trim() && proofSummary.trim())
    ) {
      setFormError(
        "To attach an initial protected proof, provide both its title and summary.",
      );
      return;
    }

    try {
      const result = (await createCampaign.mutateAsync({
        title: title.trim(),
        category,
        country: country.trim(),
        description: description.trim(),
        ...(parsedTarget !== undefined ? { targetAmount: parsedTarget } : {}),
        ...(currency.trim() ? { currency: currency.trim().toUpperCase() } : {}),
        ...(deadline.trim() ? { deadline: deadline.trim() } : {}),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
        ...(ownerName.trim() ? { ownerName: ownerName.trim() } : {}),
        ...(ownerContact.trim() ? { ownerContact: ownerContact.trim() } : {}),
        ...(institution.trim()
          ? { coordinatorInstitution: institution.trim() }
          : {}),
        ...(studentId.trim()
          ? { coordinatorIdNumber: studentId.trim() }
          : {}),
        ...(docTitle.trim() && docUrl.trim()
          ? {
              restrictedDocuments: [
                { title: docTitle.trim(), url: docUrl.trim() },
              ],
            }
          : {}),
        ...(proofTitle.trim() && proofSummary.trim()
          ? {
              protectedProofs: [
                { title: proofTitle.trim(), summary: proofSummary.trim() },
              ],
            }
          : {}),
        status: submitStatus,
      })) as { id: string; title: string; status: string };

      await queryClient.invalidateQueries();
      await refetchMine();

      setTitle("");
      setCountry("");
      setDescription("");
      setTargetAmount("");
      setDeadline("");
      setImageUrl("");
      setOwnerName("");
      setOwnerContact("");
      setInstitution("");
      setStudentId("");
      setDocTitle("");
      setDocUrl("");
      setProofTitle("");
      setProofSummary("");

      if (result.status === "active") {
        navigate(`/campaigns/${encodeURIComponent(result.id)}`);
        return;
      }

      setSuccessNotice(
        `Draft "${result.title}" saved. You can publish it anytime below.`,
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save campaign right now.",
      );
    }
  };

  const handleStatusChange = async (
    campaignId: string,
    nextStatus: "draft" | "active" | "completed",
  ) => {
    setFormError(null);
    try {
      await updateCampaign.mutateAsync({ id: campaignId, status: nextStatus });
      await queryClient.invalidateQueries();
      await refetchMine();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to update campaign status.",
      );
    }
  };

  if (sessionLoading || !authenticated) {
    return (
      <main className="explore-page">
        <div className="availability-page">
          <div className="empty-icon" aria-hidden="true">
            <IconPlant2 size={32} />
          </div>
          <h1>Redirecting to sign in...</h1>
          <p>Sign in to launch a campaign or manage your saved initiatives.</p>
          <Link className="button button-dark" to="/auth?return=%2Fstart-campaign">
            Sign in <IconArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="explore-page">
      <div className="explore-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            CREATOR STUDIO{email ? ` · ${email}` : ""}
          </div>
          <h1>
            Launch with <em>open records.</em>
          </h1>
          <p>
            Publish a student project, college event, hackathon build, or campus
            startup backed by transparent milestones and SQL persistence.
          </p>
        </div>
        <Link className="button button-outline" to="/explore">
          Explore Campaigns <IconArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <section className="creator-studio-grid">
        <form
          className="creator-form-card"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit("active");
          }}
        >
          <div className="creator-card-head">
            <IconRocket size={20} aria-hidden="true" />
            <div>
              <h2>Create a New Campaign</h2>
              <p>Fields marked optional can be added or updated anytime.</p>
            </div>
          </div>

          {formError && (
            <div className="protected-action-notice error" role="alert">
              <p>{formError}</p>
            </div>
          )}

          {successNotice && (
            <div className="protected-action-notice" role="status">
              <strong className="inline-flex items-center gap-1.5">
                <IconCheck size={16} aria-hidden="true" />
                {successNotice}
              </strong>
            </div>
          )}

          <div className="creator-field-grid">
            <label className="creator-field creator-field-full">
              <span>Campaign Title *</span>
              <input
                type="text"
                required
                minLength={3}
                maxLength={160}
                placeholder="e.g. Solar Micro-Grid Prototype for Campus Hostel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Category *</span>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as CreateCampaignCategory)
                }
              >
                {CREATE_CAMPAIGN_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="creator-field">
              <span>Country *</span>
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                placeholder="e.g. India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Target Amount (optional)</span>
              <input
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Currency (optional)</span>
              <input
                type="text"
                maxLength={10}
                placeholder="USD"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Deadline Date (optional)</span>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Cover Image URL (optional)</span>
              <input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>

            <label className="creator-field creator-field-full">
              <span>Project Story &amp; Milestones *</span>
              <textarea
                required
                minLength={10}
                maxLength={5000}
                rows={4}
                placeholder="Explain what your team is building, how funds will be allocated, and what milestones supporters can verify."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Organizer Name (optional)</span>
              <input
                type="text"
                maxLength={120}
                placeholder="Lead name or campus club"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Protected Contact Note (members only)</span>
              <input
                type="text"
                maxLength={300}
                placeholder="Campus lab email, Discord handle, or office hours"
                value={ownerContact}
                onChange={(e) => setOwnerContact(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Institution / College (for verification)</span>
              <input
                type="text"
                maxLength={160}
                placeholder="e.g. Indian Institute of Technology Delhi"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Student / Faculty ID (confidential)</span>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. 2024CSB1089 (Encrypted &amp; Protected)"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </label>

            <div className="creator-field-full" style={{ gridColumn: "1 / -1" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "0.875rem 1rem",
                  borderRadius: "0.5rem",
                  background: "rgba(29, 62, 46, 0.05)",
                  border: "1px solid rgba(29, 62, 46, 0.15)",
                  fontSize: "0.85rem",
                  color: "#1d3e2e",
                }}
              >
                <IconShieldLock size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Protected Credential Guarantee:</strong> Institutional IDs, student numbers, and coordinator contact details are stored securely in SQL audit logs and protected records. They are never published publicly or shared with third parties.
                </div>
              </div>
            </div>

            <label className="creator-field">
              <span>Restricted Document Title (optional)</span>
              <input
                type="text"
                placeholder="e.g. Budget Estimate PDF"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Restricted Document URL (optional)</span>
              <input
                type="url"
                placeholder="https://..."
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Initial Proof Title (optional)</span>
              <input
                type="text"
                placeholder="e.g. Lab Sponsorship Approval"
                value={proofTitle}
                onChange={(e) => setProofTitle(e.target.value)}
              />
            </label>

            <label className="creator-field">
              <span>Initial Proof Summary (optional)</span>
              <input
                type="text"
                placeholder="Brief summary of the verified milestone"
                value={proofSummary}
                onChange={(e) => setProofSummary(e.target.value)}
              />
            </label>
          </div>

          <div className="creator-form-actions">
            <button
              type="submit"
              className="button button-dark"
              disabled={createCampaign.isPending}
            >
              {createCampaign.isPending ? "Publishing..." : "Publish Campaign"}
              <IconArrowUpRight size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="button button-outline"
              disabled={createCampaign.isPending}
              onClick={() => void handleSubmit("draft")}
            >
              Save as Draft
            </button>
          </div>
        </form>

        <aside className="creator-sidebar-panel">
          <div className="creator-list-card">
            <h2>My Created Campaigns</h2>
            {myLoading ? (
              <p className="member-muted">Loading your campaigns...</p>
            ) : created.length === 0 ? (
              <p className="member-muted">
                You haven&apos;t created a campaign yet. Use the form to publish
                your first project or save a draft.
              </p>
            ) : (
              <ul className="creator-campaign-list">
                {created.map((item) => (
                  <li key={item.id} className="creator-campaign-item">
                    <div className="card-meta-top">
                      <span className="card-category">{item.category}</span>
                      <span className="card-status-badge">{item.status}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>
                      {item.country}
                      {item.targetAmount != null
                        ? ` · Target: ${formatCampaignAmount(item.targetAmount, item.currency)}`
                        : ""}
                    </p>
                    <div className="creator-item-actions">
                      <Link
                        className="text-link"
                        to={`/campaigns/${encodeURIComponent(item.id)}`}
                      >
                        Open{" "}
                        <IconArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                      {item.status === "draft" ? (
                        <button
                          type="button"
                          className="mini-action-btn"
                          disabled={updateCampaign.isPending}
                          onClick={() =>
                            void handleStatusChange(item.id, "active")
                          }
                        >
                          Publish
                        </button>
                      ) : item.status === "active" ? (
                        <button
                          type="button"
                          className="mini-action-btn"
                          disabled={updateCampaign.isPending}
                          onClick={() =>
                            void handleStatusChange(item.id, "completed")
                          }
                        >
                          Mark Completed
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="creator-list-card">
            <h2 className="inline-flex items-center gap-2">
              <IconBookmark size={18} aria-hidden="true" /> Saved Campaigns
            </h2>
            {myLoading ? (
              <p className="member-muted">Loading saved campaigns...</p>
            ) : saved.length === 0 ? (
              <p className="member-muted">
                No saved campaigns yet. Open any public campaign and click Save /
                Follow to keep it here.
              </p>
            ) : (
              <ul className="creator-campaign-list">
                {saved.map((item) => (
                  <li key={item.id} className="creator-campaign-item">
                    <div className="card-meta-top">
                      <span className="card-category">{item.category}</span>
                      <span className="card-status-badge">{item.status}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="creator-item-actions">
                      <Link
                        className="text-link"
                        to={`/campaigns/${encodeURIComponent(item.id)}`}
                      >
                        View Campaign{" "}
                        <IconArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
