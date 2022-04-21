import { ReactElement } from 'react';
import { GetStaticProps } from 'next';

import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { PrismicDocument, Query } from '@prismicio/types';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  return (
    <main className={styles.container}>
      {postsPagination.results.map((post: Post) => (
        <article className={styles.content} key={post.uid}>
          <Link href={`/post/${post.uid}`}>
            <a>
              <h1>{post.data.title}</h1>
            </a>
          </Link>
          <span>{post.data.subtitle}</span>
          <div className={styles.articleInfo}>
            <div>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>

            <div>
              <FiUser />
              <time>{post.data.author}</time>
            </div>
          </div>
        </article>
      ))}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: {
    postsPagination: PostPagination;
  };
}> => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts');

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    }),
  };

  return {
    props: {
      postsPagination,
    },
  };
};
