import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date_formatted: string | null;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  readTime: string;
  first_publication_date_formatted: string;
}

export default function Post({
  post,
  readTime,
  first_publication_date_formatted,
}: PostProps): ReactElement {
  // TODO
  return (
    <main className={styles.container}>
      <article className={styles.post}>
        <img src={post.data.banner.url} alt="" />

        <h1>{post.data.title}</h1>

        <section className={styles.info}>
          <div>
            <FiCalendar />
            <time>{first_publication_date_formatted}</time>
          </div>

          <div>
            <FiUser />
            <span>{post.data.author}</span>
          </div>

          <div>
            <FiClock />
            <span>{readTime}</span>
          </div>
        </section>

        {post.data.content.map(content => (
          <>
            <h2>{content.heading}</h2>
            <div
              className={styles.postContent}
              dangerouslySetInnerHTML={{ __html: content.body[0].text }}
            />
          </>
        ))}
      </article>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  return {
    paths: posts.results.map(post => {
      return { params: { slug: post.uid } };
    }),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});
  const readTime = response.data.content.reduce(content => {
    const words = RichText.asText(content.body).split(' ').length;

    return `${Math.ceil(words / 200)} min`;
  });

  const post = {
    first_publication_date: response.first_publication_date,

    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [
            {
              text: RichText.asHtml(content.body),
            },
          ],
        };
      }),
    },
  };

  return {
    props: {
      post,
      readTime,
      first_publication_date_formatted: format(
        new Date(response.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    },
  };
};
