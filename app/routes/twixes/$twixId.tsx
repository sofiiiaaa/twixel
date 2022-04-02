import type { Twix } from "@prisma/client";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  Link,
  useLoaderData,
  useCatch,
  redirect,
  useParams,
  Form
} from "remix";

import { db } from "~/utils/db.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

import { TwixDisplay } from "~/components/twix";


export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No twix",
      description: "No twix found",
    };
  }
  return {
    title: `"${data.twix.title}" twix`,
    description: `Enjoy the "${data.twix.title}" twix and much more`,
  };
};

type LoaderData = { twix: Twix; isOwner: boolean };

export const loader: LoaderFunction = async ({
  request,
  params,
}) => {
  const userId = await getUserId(request);
  const twix = await db.twix.findUnique({
    where: { id: params.twixId },
  });
  if (!twix) {
    throw new Response("What a twix! Not found.", {
      status: 404,
    });
  }
  const data: LoaderData = {
    twix,
    isOwner: userId === twix.twixesterId,
  };
  return data;
};

export const action: ActionFunction = async ({
  request,
  params,
}) => {
  const form = await request.formData();
  if (form.get("_method") !== "delete") {
    throw new Response(
      `The _method ${form.get("_method")} is not supported`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const twix = await db.twix.findUnique({
    where: { id: params.twixId },
  });
  if (!twix) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }
  if (twix.twixesterId !== userId) {
    throw new Response(
      "Pssh, nice try. That's not your twix",
      {
        status: 401,
      }
    );
  }
  await db.twix.delete({ where: { id: params.twixId } });
  return redirect("/twixes");
};

export default function TwixRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <TwixDisplay twix={data.twix} isOwner={data.isOwner} />
  );
}

  
//     <div>
//       <p>Here's your hilarious twix:</p>
//       <p>{data.twix.content}</p>
//       <Link to=".">{data.twix.title} Permalink</Link>
//       {data.isOwner ? (
//         <Form method="post">
//           <input
//             type="hidden"
//             name="_method"
//             value="delete"
//           />
//           <button type="submit" className="button">
//             Delete
//           </button>
//         </Form>
//       ) : null}
//     </div>
//   );
// }

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 400: {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      );
    }
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.twixId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.twixId} is not your twix.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  const { twixId } = useParams();
  return (
    <div className="error-container">{`There was an error loading twix by the id ${twixId}. Sorry.`}</div>
  );
}