import Image from "next/image";
import { Avatar } from "../Avatar";
import { Star } from "../icons/Star";
import styles from "./cardpost.module.css";
import Link from "next/link";
import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const CardPost = (props) => {
  const { post, highlight, rating, category, isFetching, currentPage } = props;

  const queryClient = useQueryClient();

  const { mutate, isError } = useMutation({
    mutationFn: async (postData) => {
      return await fetch('http://localhost:3000/api/thumbs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      }).then(res => {
        if (!res.ok){
          throw new Error('Falha ao salvar o like');
        }

        return res.json();
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('post', post.slug);
      queryClient.invalidateQueries('posts', currentPage);
    },
    onError: (err, variables) => {
      console.error(`Error ao salvar o slug ${variables.slug}`, { err });
    }
  })
  return (
    <article className={styles.card} style={{ width: highlight ? 993 : 486 }}>
      <header className={styles.header}>
        <figure style={{ height: highlight ? 300 : 133 }}>
          <Image
            src={post.cover}
            fill
            alt={`Capa do post de titulo: ${post.title}`}
          />
        </figure>
      </header>
      <section className={styles.body}>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <Link href={`/posts/${post.slug}`}>Ver detalhes</Link>
      </section>
      <footer className={styles.footer}>
        <div style={{position: 'relative'}} className={styles.actions}>
          <form
            onClick={(e) => {
              e.preventDefault();
              mutate({ slug: post.slug });
          }}>
            <ThumbsUpButton disable={isFetching} />
            <p>{post.likes}</p>
          </form>
            {isError && <p style={{position: 'absolute', bottom: '0', width: '300px'}}>Erro ao salvar o like</p>}
          <div>
            <ModalComment />
            <p>{post.comments.length}</p>
          </div>
          {rating && (
            <div style={{ margin: "0 3px" }}>
              <Star />
              <p style={{ marginTop: "1px" }}>{rating}</p>
            </div>
          )}
        </div>
        {category && (
          <div
            className={styles.categoryWrapper}
            style={{ fontSize: highlight ? "15px" : "12px" }}
          >
            <span className={styles.label}>Categoria: </span>{" "}
            <span className={styles.category}>{category}</span>
          </div>
        )}
        <Avatar imageSrc={post.author.avatar} name={post.author.username} />
      </footer>
    </article>
  );
};
