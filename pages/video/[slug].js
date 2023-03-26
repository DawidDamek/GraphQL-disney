/* eslint-disable @next/next/no-img-element */
import { GraphQLClient, gql } from 'graphql-request';
import Link from 'next/link';
import { useState } from 'react';

export const getServerSideProps = async (pageContext) => {
  const url = process.env.ENDPOINT;
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_CMS_TOKEN}`,
    },
  });
  const pageSlug = pageContext.query.slug;

  const query = gql`
    query ($pageSlug: String!) {
      video(where: { slug: $pageSlug }) {
        createdAt
        id
        title
        descrption
        seen
        slug
        tags
        thumbnail {
          id
          url
        }
        mp4 {
          url
        }
      }
    }
  `;

  const variables = {
    pageSlug,
  };
  const data = await graphQLClient.request(query, variables);
  const video = data.video;

  return {
    props: {
      video,
    },
  };
};

const changeToSeen = async (slug) => {
  await fetch('/api/changeToSeen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug }),
  });
};

const Video = ({ video }) => {
  const [watching, setWatching] = useState(false);
  return (
    <>
      {!watching && (
        <img
          className='video-image'
          src={video.thumbnail.url}
          alt={video.title}
        />
      )}
      {!watching && (
        <>
          <Link href='/'>
            <p className='back'>Back</p>
          </Link>
          <div className='info'>
            <p>{video.tags.join(', ')}</p>
            <p>{video.description}</p>
            <button
              className='video-overlay'
              role='button'
              onClick={() => {
                changeToSeen(video.slug);
                watching ? setWatching(false) : setWatching(true);
              }}
            >
              Play
            </button>
          </div>
        </>
      )}
      {watching && (
        <video width='100%' controls>
          <source src={video.mp4.url} type='video/mp4' />
        </video>
      )}
      <div
        className='info-footer'
        onClick={() => {
          watching ? setWatching(false) : null;
        }}
      ></div>
    </>
  );
};
export default Video;
