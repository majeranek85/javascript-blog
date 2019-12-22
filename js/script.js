'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
  cloudTagLink: Handlebars.compile(document.querySelector('#template-cloud-tag-link').innerHTML),
  sideAuthorLink: Handlebars.compile(document.querySelector('#template-side-author-link').innerHTML),
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAutorSelector = '.post-author',
  optAllTagLinksSelector = '[href^="#tag-"]',
  optAllAuthorLinksSelector = '[href^="#author-"]',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

//EVENT HANDLER
const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute form the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

//GENERATING TITLE LINKS
const generateTitleLinks = function(customSelector = ''){
  /*[DONE] remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /*[DONE] for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){
    /*[DONE] get the article id */
    const articleId = article.getAttribute('id');
    /*[DONE] find the article element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /*[DONE] get the title from the title element */

    /*[DONE] create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /*[DONE] insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
};

generateTitleLinks();

const calculateTagsParams = function(tags){

  const params = {max: 0, min: 999999};

  for (let tag in tags){
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
};

const calculateTagClass = function(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
};

//GENERATING TAG LINKS
const generateTags = function(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /*[DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /*[DONE] START LOOP: for every article: */
  for (let article of articles){
    /*[DONE] find tags wrapper */
    const tagList = article.querySelector(optArticleTagsSelector);
    /*[DONE] make html variable with empty string */
    let html = '';
    /*[DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /*[DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /*[DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray){
      /*[DONE] generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: tag, tag: tag};
      const linkHTML = templates.articleTagLink(linkHTMLData);
      /*[DONE] add generated code to html variable */
      html = linkHTML + html;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /*[DONE] END LOOP: for each tag */
    }
    /*[DONE] insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
  /*[DONE] END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  //let allTagsHTML = '';
  const allTagsData = {tags: []};
  /*[NEW] START LOOP: for each tag in allTags:*/
  for (let tag in allTags){
    //const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>';
    /*[NEW] generate code of a link and add it to allTagsHTML*/
    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    console.log(allTagsData);
  /*[NEW] END LOOP: for each tag in allTags:*/
  }
  /*[NEW] add html from allTagsHTML to tagList*/
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.cloudTagLink(allTagsData);
};

generateTags();

// EVENT HANDLER
const tagClickHandler = function(event){
  /*[DONE] prevent default action for this event */
  event.preventDefault();
  /*[DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /*[DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /*DONE make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /*[DONE] find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /*[DONE] START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks){
    /*[DONE] remove class active */
    activeTagLink.classList.remove('active');
  /*[DONE] END LOOP: for each active tag link */
  }
  /*[DONE] find all tag links with "href" attribute equal to the "href" constant */
  const sameTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /*[DONE] START LOOP: for each found tag link */
  for (let sameTagLink of sameTagLinks){
    /*[DONE] add class active */
    sameTagLink.classList.add('active');
  /*[DONE] END LOOP: for each found tag link */
  }
  /*[DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};

//EVENT LISTENER
const addClickListenersToTags = function(){
  /*[DONE] find all links to tags */
  const taglinks = document.querySelectorAll(optAllTagLinksSelector);
  /*[DONE] START LOOP: for each link */
  for (let tagLink of taglinks){
    /*[DONE] add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /*[DONE] END LOOP: for each link */
  }
};

addClickListenersToTags();

//GENERATING AUTHOR LINKS
const generateAuthors = function(){
  /* [NEW] create a new variable allAuthor with an empty object */
  let allAuthors = {};
  /*[DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /*[DONE] START LOOP: for every article: */
  for (let article of articles){
    /*[DONE] find authors list wrapper */
    const author = article.querySelector(optArticleAutorSelector);
    /*[DONE] make html variable with empty string */
    let html = '';
    /*[DONE] get tags from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    /*[DONE] generate HTML of the link */
    //const linkHTML = 'by <a href="#author-' + articleAuthor + '"><span class="author-name">' + articleAuthor + '</span></a>'
    const linkHTMLData = {id: articleAuthor, name: articleAuthor};
    const linkHTML = templates.articleAuthorLink(linkHTMLData);
    /*[DONE] add generated code to html variable */
    html += linkHTML;
    /*[DONE] insert HTML of all the links into the authors list wrapper */
    author.innerHTML = html;
    /* [NEW] check if this link is NOT already in allAuthors object */
    if (!allAuthors.hasOwnProperty(articleAuthor)){
      /* [NEW] add generated code to allAuthors object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  /*[DONE] END LOOP: for each article */
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector('.authors');
  /* [NEW] create variable for all links HTML code*/
  //let allAuthorsHTML = '';
  let allAuthorsData = {authors:[]};
  /*[NEW] START LOOP: for each author in allAuthors:*/
  for (let everyAuthor in allAuthors){
    //const authorLinkHTML = '<li><a href="#author-' + everyAuthor + '"><span>' + everyAuthor + ' (' + allAuthors[everyAuthor] + ')' + '</span></a></li>';
    /*[NEW] generate code of a link and add it to allAuthorsHTML*/
    //allAuthorsHTML += authorLinkHTML;
    allAuthorsData.authors.push({
      author: everyAuthor,
      count: allAuthors[everyAuthor]
    });
  /*[NEW] END LOOP: for each author in allAuthors:*/
  }
  /*[NEW] add html from allAuthorsHTML to authorList*/
  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.sideAuthorLink(allAuthorsData);
};

generateAuthors();

//EVENT HANDLER
const authorClickHandler = function(event){
  /*[DONE] prevent default action for this event */
  event.preventDefault();
  /*[DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /*[DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /*[DONE] make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /*[DONE] find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /*[DONE] START LOOP: for each active author link */
  for (let activeAuthorLink of activeAuthorLinks){
    /*[DONE] remove class active */
    activeAuthorLink.classList.remove('active');
  /*[DONE] END LOOP: for each active author link */
  }
  /*[DONE] find all author links with "href" attribute equal to the "href" constant */
  const sameAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /*[DONE] START LOOP: for each found author link */
  for (let sameAuthorLink of sameAuthorLinks){
    /*[DONE] add class active */
    sameAuthorLink.classList.add('active');
  /*[DONE] END LOOP: for each found author link */
  }
  /*[DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
};

//EVENT LISTENER
const addClickListenersToAuthors = function(){
  /*[DONE] find all links to author */
  const authorlinks = document.querySelectorAll(optAllAuthorLinksSelector);
  /*[DONE] START LOOP: for each link */
  for (let authorLink of authorlinks){
    /*[DONE] add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  /*[DONE] END LOOP: for each link */
  }
};

addClickListenersToAuthors();
