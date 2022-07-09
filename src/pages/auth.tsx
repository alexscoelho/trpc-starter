import { NextPageWithLayout } from './_app';

const AuthViewPage: NextPageWithLayout = () => {
  return (
    <form>
      <label htmlFor="name">Name</label>
      <br />
      <input id="name" name="name" type="text" />
      <br />

      <label htmlFor="email">Email</label>
      <br />
      <input id="email" name="email" type="email" />
      <br />

      <label htmlFor="password">Password</label>
      <br />
      <input id="password" name="password" type="password" />
      <br />

      <button type="submit">Login</button>
    </form>
  );
};

export default AuthViewPage;
