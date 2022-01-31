import { serialize } from 'next-mdx-remote/serialize'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useEffect } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

import { useMdxComponentsContext } from '../../context/mdxContext'
import Thumbnail from '../../components/Thumbnail'
import { IPost } from '../../types/post'
import { getPost, getAllPosts } from '../../utils/mdxUtils'
import Prerequisites from '../../components/Prerequisites'
import { ParsedUrlQuery } from 'querystring'
import Stacks from '../../components/Stacks'

type Props = {
  source: MDXRemoteSerializeResult,
  frontMatter: Omit<IPost, 'slug'>
}

const components = {
  Prerequisites,
  Stacks,
}

const PostPage: React.FC<Props> = ({ source, frontMatter }: Props) => {
  const { setPrerequisites, setStacks } = useMdxComponentsContext()

  useEffect(() => {
    setPrerequisites(frontMatter.prerequisites)
    setStacks(frontMatter.stacks)
  }, [
    setPrerequisites,
    setStacks,
    frontMatter.prerequisites,
    frontMatter.stacks
  ])

  return (
    <div>
      <article className='prose prose-green'>
        <div className='mb-4'>
          <Thumbnail title={frontMatter.title} src={frontMatter.thumbnail} />
          <h1>{frontMatter.title}</h1>
          <p>{frontMatter.description}</p>
          <MDXRemote components={components} {...source} />
        </div>
      </article>
    </div>
  )
}

export default PostPage

interface Iparams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as Iparams
  const { content, data } = getPost(slug)

  const mdxSource = await serialize(content, { scope: data })
  return {
    props: {
      source: mdxSource,
      frontMatter: data
    }
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getAllPosts(['slug'])
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug
    }
  }))

  return {
    paths,
    fallback: false
  }
}
