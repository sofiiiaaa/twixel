import type { LinksFunction, MetaFunction } from "remix";
import { Link } from "remix";

export const meta: MetaFunction = () => ({
  title: "Twixes",
  description:
    "Il Twitter di Voxel!",
});

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Twixes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="twixes">Read Twixes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
    return (
      <div>
        Ooops! C'è stato un problema
      </div>
    );
  }