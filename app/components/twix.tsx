import { Link, Form } from "remix";
import type { Twix } from "@prisma/client";

export function TwixDisplay({
  twix,
  isOwner,
  canDelete = true,
}: {
  twix: Pick<Twix, "content" | "title">;
  isOwner: boolean;
  canDelete?: boolean;
}) {
  return (
    <div>
      <p>Here's your hilarious twix:</p>
      <p>{twix.content}</p>
      <Link to=".">{twix.title} Permalink</Link>
      {isOwner ? (
        <Form method="post">
          <input
            type="hidden"
            name="_method"
            value="delete"
          />
          <button
            type="submit"
            className="button"
            disabled={!canDelete}
          >
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
}