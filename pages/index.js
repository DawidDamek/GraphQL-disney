/* eslint-disable @next/next/no-img-element */
import { GraphQLClient, gql } from 'graphql-request';
import Image from 'next/image';
import Section from '@/components/Section';
import NavBar from '@/components/Navbar';
import Link from 'next/link';

export const getStaticProps = async () => {
  const url = process.env.ENDPOINT;
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_CMS_TOKEN}`,
    },
  });
  const videosQuery = gql`
    query {
      videos {
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

  const accountQuery = gql`
    query {
      account(where: { id: "clevrmjs8jl9e09w6aq85vrpu" }) {
        username
        avatar {
          url
        }
      }
    }
  `;

  const videosData = await graphQLClient.request(videosQuery);
  const videos = videosData.videos;

  const accountData = await graphQLClient.request(accountQuery);
  const account = accountData.account;

  return {
    props: {
      videos,
      account,
    },
  };
};

const Home = ({ videos, account }) => {
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)];
  };

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre));
  };

  const unSeenVideos = (videos) => {
    return videos.filter(
      (video) => video.seen === false || video.seen === null
    );
  };

  return (
    <>
      <div className='app'>
        <NavBar account={account} />
        <div className='main-video'>
          <img
            src={randomVideo(videos).thumbnail.url}
            alt={randomVideo(videos).title}
          />
        </div>

        <Section genre={'Recommended for you'} videos={unSeenVideos(videos)} />
        <Section
          id='family'
          genre={'Family'}
          videos={filterVideos(videos, 'family')}
        />
        <Section
          id='classic'
          genre={'Classic'}
          videos={filterVideos(videos, 'classic')}
        />
        <Section
          id='disniey'
          genre={'Disney'}
          videos={filterVideos(videos, 'disney')}
        />
        <Section genre={'Marvel'} videos={filterVideos(videos, 'marvel')} />
        <Section
          id='adventure'
          genre={'Adventure'}
          videos={filterVideos(videos, 'adventure')}
        />
        <Section
          id='comedy'
          genre={'Comedy'}
          videos={filterVideos(videos, 'comedy')}
        />
        <Section
          id='thriller'
          genre={'Thriller'}
          videos={filterVideos(videos, 'thriller')}
        />
      </div>
    </>
  );
};

export default Home;
