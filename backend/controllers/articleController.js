import Article from '../models/Article.js';

export const createArticle = async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = await Article.create({ title, content, author: req.user._id });
    await article.populate('author', 'name email');
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyArticlesbyId = async(req,res) =>{
  try{
    const article = await Article.findById(req.params.id);
    if(!article) return res.status(404).json({message: 'error loading article'});
      res.json(article)
  }catch(err){
    res.status(500).json({message: err.message});
  }
}


export const updateArticle = async(req,res) => {
  try{
    const {title, content} = req.body;
    const article = await Article.findByIdAndUpdate(req.params.id, {title, content}, {new:true});
    if(!article) return res.status(400).json({message: "Article not found"});
    res.json(article);
  }catch(err){
    res.status(500).json({message: err.message});
  }

}

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};