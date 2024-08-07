import { useContext, useState } from "react";
import NewsContext from "../context/NewsContext";
import ReadTheNewsHere from "./ReadTheNewsHere";
import FavoriteButton from "./FavoriteButton";
import FavoriteContext from "../context/FavoriteContext";
import { NewsType } from "../types";
import { calculateDaysDifference } from "../utils/function";
import * as Style from '../styles/NewsCardsStyle';

function NewsCards() {
  // Cria os estados para armazenar as informações
  const [visibleNewsCount, setVisibleNewsCount] = useState(9);
  const [filter, setFilter] = useState("Mais Recentes");
  
  const filterBarStringArray = ["Mais Recentes", "Release", "Notícia", "Favoritas"];
  
  // Invoca o NewsContext, que é o array advindo da API
  const news = useContext(NewsContext);

  // Invoca o FavoriteContext e desestrutura
  const favoritesContext = useContext(FavoriteContext);
  const { favorites ,toggleFavorite } = favoritesContext
  
  // Usa slice para obter as notícias a serem exibidas com base em visibleNews
  const remainingNews = news.slice(1);
  const firstNineNews = remainingNews.slice(0, visibleNewsCount);

  // Atualiza o estado das notícias favoritas quando o botão de favoritar é clicado
  function handleFavoriteClick(news: NewsType) {
    toggleFavorite(news.id); 
  }
  
  // Incrementa o número de notícias visíveis quando o botão "Mais notícias" é clicado.
  function handleLoadMoreClick() {
    setVisibleNewsCount((prevCount) => prevCount + 9);
  }

  function renderCards(newsToRender: NewsType[]) {
    return newsToRender.map((item) => {
      const currentDate = new Date();
      const dateSplit = item.data_publicacao.split('/');
      const day = parseInt(dateSplit[0], 10);
      const month = parseInt(dateSplit[1], 10) -1;
      const year = parseInt(dateSplit[2], 10);
      const newsDate = new Date(year, month, day);
      const daysAgo = calculateDaysDifference(currentDate, newsDate);

      return (
        <Style.EachNewsCard key={item.id}>
          <Style.TextContentDiv>
            <h3>{`${item.titulo}`}</h3>
            <p>{item.introducao}</p>
            <p>{`Há ${daysAgo} dia(s) atrás`}</p>
          </Style.TextContentDiv>
          <Style.DivReadAndFavorite>
            <ReadTheNewsHere
              link={item.link}
              onClick={() => window.open(item.link, "_blank")}
              />
            <FavoriteButton
              isFavorite={favorites.includes(item.id)}
              onClick={() => handleFavoriteClick(item)}
            />
          </Style.DivReadAndFavorite>
        </Style.EachNewsCard>
      );
    });
  }

  const filteredNews: NewsType[] = 
    filter === "Mais Recentes"
    ? firstNineNews
    : filter === "Release"
    ? news.filter((item) => item.tipo === "Release").slice(0,visibleNewsCount)
    : filter === "Notícia"
    ? news.filter((item) => item.tipo === "Notícia").slice(0,visibleNewsCount)
    : filter === "Favoritas"
    ? favorites.map((id) => news.find((item) => item.id === id))
  : [];

  return (
      <div>
        <Style.FilterBarDiv>
          {filterBarStringArray.map((element) => (
            <Style.FilterBarButtons
              key={element}
              onClick={ () => setFilter(element) }
              style={{
                borderBottom: element === filter ? "ridge #C31815" : "none"
              }}
            >
              {element}
            </Style.FilterBarButtons>
          ))}
        </Style.FilterBarDiv>

        <Style.GridDiv>
          {filter === "Favoritas" && favorites.length === 0 ? (
            <h2>Nenhuma notícia favoritada.</h2>
            ) : (
            renderCards(filteredNews)
          )}
        </Style.GridDiv>

        <div>
        {filter !== "Favoritas" && visibleNewsCount < remainingNews.length && (
          <Style.ReadMoreButton onClick={handleLoadMoreClick}>Mais notícias</Style.ReadMoreButton>
        )}
        </div>
      </div>
  );
}

export default NewsCards;
