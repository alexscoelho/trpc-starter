import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const PostViewPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const id = useRouter().query.id as string;
  const postQuery = trpc.useQuery(['post.byId', { id }]);
  const commentsQuery = trpc.useQuery(['comment.byPostId', { id }]);
  const addComment = trpc.useMutation('comment.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['comment.byPostId']);
    },
  });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;

  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <p>{data.text}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <h1>Post Comments</h1>
      <ul>
        {commentsQuery?.data?.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>

      <h1>Add a Comment</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @link https://react-hook-form.com/
           */

          const $text: HTMLInputElement = (e as any).target.elements.text;
          const input = {
            text: $text.value,
            postId: id,
          };
          try {
            await addComment.mutateAsync(input);

            $text.value = '';
          } catch {}
        }}
      >
        <label htmlFor="text">Text</label>
        <br />
        <textarea id="text" name="text" placeholder="some comment"></textarea>
        <br />
        <button type="submit">Add Comment</button>
      </form>
    </>
  );
};

export default PostViewPage;
