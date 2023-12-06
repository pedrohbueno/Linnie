// chamar bibliotecas ------------------------------------------------------------------------------------------------------
const multer = require('multer');
const { join } = require('path');
const bcrypt = require('bcrypt');
const express = require('express');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const { sequelize, UserL } = require('./models/connectionv');
const app = require('./app');
const { UsuarioL, Pattern, Tags, Ptype, Size, Decade, CommentL, Likes, Follow} = require('./models/crud');
const useragent = require('express-useragent'); // Biblioteca para obter informações do navegador
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");



const routes = express.Router();
const appexpress = express();

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions)); // Habilitar o CORS para rota especifica
appexpress.use(useragent.express());
app.use(bodyParser.json());

Pattern.belongsTo(UsuarioL, { foreignKey: 'fk_id_user', targetKey: 'pk_id_user' });
UsuarioL.hasMany(Pattern, { foreignKey: 'fk_id_user', sourceKey: 'pk_id_user' });

Pattern.belongsTo(Size, { foreignKey: 'fk_id_size', targetKey: 'pk_id_size' });
Size.hasOne(Pattern, { foreignKey: 'fk_id_size', sourceKey: 'pk_id_size' });

Pattern.belongsTo(Tags, { foreignKey: 'fk_id_tag', targetKey: 'pk_id_tag' });
Tags.hasOne(Pattern, { foreignKey: 'fk_id_tag', sourceKey: 'pk_id_tag' });

Pattern.belongsTo(Ptype, { foreignKey: 'fk_id_pt', targetKey: 'pk_id_pt' });
Ptype.hasOne(Pattern, { foreignKey: 'fk_id_pt', sourceKey: 'pk_id_pt' });

CommentL.belongsTo(UsuarioL, { foreignKey: 'fk_id_user', targetKey: 'pk_id_user' });
UsuarioL.hasMany(CommentL, { foreignKey: 'fk_id_user', sourceKey: 'pk_id_user' });

Pattern.hasMany(CommentL, { foreignKey: 'fk_id_patt' });
CommentL.belongsTo(Pattern, { foreignKey: 'fk_id_patt' });



function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Verifique o token JWT usando a mesma chave secreta usada para criar o token no login
  jwt.verify(token.split(' ')[1], 'sua_chave_secreta', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.decoded = decoded;
    next(); // Continue para a próxima rota
  });
}

// Configuração do Multer para lidar com o upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let queryId = ''
// =========== UserL =========================================================================
// Chamando dados do cadastro ------------------------------------------------------------------------------------------------
app.post('/add', async function (req, res) {
  const { name_user, email_user, pfp_user, pass_user, conf_pass_user } = req.body;

  try {
    // Verificar se a senha é igual à confirmação de senha ------------------------------------------------------------------
    if (pass_user !== conf_pass_user) {
      return res.send('A senha e a confirmação de senha não são iguais.');
    }

    // Criptografar a senha -----------------------------------------------------------------------------------------------
    const hashedPassword = await bcrypt.hash(pass_user, 10);
    const hashedPasswordconf = await bcrypt.hash(conf_pass_user, 10);

    console.log(hashedPassword.length);


    // Criação do usuário no banco de dados -----------------------------------------------------------------------------
    const email = await UsuarioL.findOne({
      attributes: ['pk_id_user', 'email_user', 'pass_user'],
      where: {
        email_user: email_user,
      }
    });

    if (!email) {
      const user = await UsuarioL.create({
        name_user,
        email_user,
        pfp_user,
        pass_user: hashedPassword, // Armazena a senha criptografada no banco
        conf_pass_user:hashedPasswordconf,
      });
      const token = jwt.sign({ pk_id_user: user.pk_id_user }, 'sua_chave_secreta', { expiresIn: '12h' });
      return res.json({ token });
    }else{
      return res.send('Email já cadastrado')
    }
    
    
    
  } catch (error) {
    return res.send('Houve um erro na criação do usuário: ' + error);
  }
});

// função para o usuario logar -------------------------------------------------------------------------------

app.post('/login', async (req, res) => {
  try {
    const { email_user, pass_user } = req.body;

    if (!email_user || !pass_user) {
      return res.status(400).json({
        erro: true,
        mensagem: "Credenciais inválidas. Certifique-se de fornecer um email e senha.",
      });
    }

    const user = await UsuarioL.findOne({
      attributes: ['pk_id_user', 'email_user', 'pass_user'],
      where: {
        email_user,
      }
    });

    if (!user) {
      return res.status(401).json({
        erro: true,
        mensagem: "Credenciais inválidas. Email não encontrado.",
      });
    }

    const userPassBuffer = user.pass_user.toString('utf8');
    if (!(await bcrypt.compare(pass_user, userPassBuffer))) {
      return res.status(401).json({
        erro: true,
        mensagem: "Credenciais inválidas. Senha incorreta.",
      });
    }

    const token = jwt.sign({ pk_id_user: user.pk_id_user }, 'sua_chave_secreta', { expiresIn: '12h' });
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: true,
      mensagem: "Ocorreu um erro ao processar a requisição.",
    });
  }
});

app.post('/update', verifyToken,  async (req, res) => {
  const {nick_user, name_user, pfp_user } = req.body

  UsuarioL.update(
    {
      nick_user:nick_user,
      name_user: name_user,
      pfp_user: pfp_user,
    },
    {
      where: { pk_id_user: req.decoded.pk_id_user }
    }
  )
  .then((result) => {
    console.log('Update bem-sucedido: ', result)
    return res.sendStatus(200)
  })
  .catch((error) => {
    console.error('Erro ao atualizar: ', error)
  })
})
let emailVer = ''
app.post('/emailVerification',  async (req, res) => {
  const { email_user } = req.body

  await UsuarioL.findOne({
    attributes: ['email_user'],
    where: {
      email_user: email_user,
    }
  })
  .then((result) => {
    emailVer = email_user
    return res.sendStatus(200)
  })
  .catch((error) => {
    console.error('Erro ao atualizar: ', error)
  })
})

app.post('/passUpdate',  async (req, res) => {
  const {pass_user,conf_pass_user } = req.body
  if (pass_user !== conf_pass_user) {
    return res.send('A senha e a confirmação de senha não são iguais.');
  }

  // Criptografar a senha -----------------------------------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash(pass_user, 10);
  const hashedPasswordconf = await bcrypt.hash(conf_pass_user, 10);

  console.log(hashedPassword.length);

  UsuarioL.update(
    {
      pass_user: hashedPassword,
      conf_pass_user: hashedPasswordconf,
    },
    {
      where: { email_user: emailVer }
    }
  )
  .then((result) => {
    console.log('Update bem-sucedido: ', result)
    return res.sendStatus(200)
  })
  .catch((error) => {
    console.error('Erro ao atualizar: ', error)
  })
})

app.post('/like', verifyToken, async (req, res) => {
  try {
    const { pk_id_patt } = req.body;
    const pk_id_user = req.decoded.pk_id_user;
    let isLiked= ''
    if(!isNaN(pk_id_patt) && !isNaN(pk_id_user)){
      isLiked = await Likes.findOne({
      attributes: ['fk_id_user', 'fk_id_patt'],
      where: {
        fk_id_user: pk_id_user,
        fk_id_patt: pk_id_patt
      }
    });}  

    console.log(pk_id_patt, pk_id_user, isLiked)
    if (isLiked) {
      // Se já existir um "like", exclua-o
      await Likes.destroy({
        where: {
          fk_id_user: pk_id_user,
          fk_id_patt: pk_id_patt
        }
      });

      return res.status(200).send('Descurtido com sucesso.');
    } else {
      // Se não existir um "like", crie-o
      await Likes.create({
        fk_id_user: pk_id_user,
        fk_id_patt: pk_id_patt
      });

      return res.status(200).send('Curtido com sucesso.');
    }
  } catch (error) {
    console.error('Erro na operação de "like":', error);
    return res.status(500).send('Houve um erro na operação de "like": ' + error);
  }
});

app.get('/countLike', async (req, res) => {
  queryId = parseInt(req.query.pk_id_patt);
  console.log(queryId)
  let likes= ''
  if (!isNaN(queryId)) {
    likes = await Likes.findAll({
      attributes: ['pk_id_like', 'fk_id_patt'], 
      where: {
        fk_id_patt: queryId
      }
    }); 
  }
  const numberLikes = likes.length
  return res.json(numberLikes);
});

app.get('/liked', verifyToken, async (req, res) => {
  queryId = parseInt(req.query.pk_id_patt);
  const liked = await Likes.findOne({
    attributes: ['pk_id_like', 'fk_id_patt',  'fk_id_user'], 
    where: {
      fk_id_patt: queryId,
      fk_id_user: req.decoded.pk_id_user
    }
  }); 
  if (liked) {
    return res.json({bool_liked: true})
  }else{
    return res.json({bool_liked: false})
  }
});



app.get('/profile', verifyToken,  async (req, res) => {
  const profile_query = req.query.profile_query;
  const user = await UsuarioL.findOne({
    attributes: ['pk_id_user', 'name_user', 'pfp_user', 'suspend_user'], 
    where:{
      pk_id_user: profile_query ?  profile_query : req.decoded.pk_id_user
    }
  }); 

  const adm = await UsuarioL.findOne({
    attributes: ['isadm_user'], 
    where:{
      pk_id_user: req.decoded.pk_id_user
    }
  }); 
  const Followed = await Follow.findAll({
    attributes: ['pk_id_follow', 'fk_user1_follow'],
    where: {
      fk_user1_follow: profile_query ?  profile_query : req.decoded.pk_id_user
    }
  })
  let boolFollowed = ''
  if (profile_query && req.decoded.pk_id_user) {
    boolFollowed = await Follow.findOne({
      attributes: ['pk_id_follow', 'fk_user1_follow', 'fk_user2_follow'],
      where: {
        fk_user1_follow: profile_query,
        fk_user2_follow: req.decoded.pk_id_user
      }
    })
  }
  
  console.log('boolFollowed', boolFollowed)

  const Following = await Follow.findAll({
    attributes: ['pk_id_follow', 'fk_user2_follow'],
    where: {
      fk_user2_follow: profile_query ?  profile_query : req.decoded.pk_id_user
    }
  })
  const numberFollowing = Following.length
  const numberFollowed = Followed.length
  if(user ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:"erro usuario ou a senha estão incorretos! este email não foi encontrado"
    })
  }
  const userId = profile_query ?  profile_query : req.decoded.pk_id_user
  return res.json({
    pk_id_user: user.pk_id_user,
    pfp_user: user.pfp_user,
    name_user: user.name_user, 
    suspend_user: user.suspend_user,
    isadm_user: adm.isadm_user,
    following: numberFollowing,
    followed: numberFollowed,
    bool_follow: boolFollowed ? true : false
  })

});

app.post('/followUser', verifyToken,  async (req, res) => {
  const {pk_id_user} = req.body;
  const profile_logged = req.decoded.pk_id_user
  try {
    let isFollowed= ''
    if(!isNaN(profile_logged) && !isNaN(pk_id_user)){
      isFollowed = await Follow.findOne({
      attributes: ['fk_user1_follow', 'fk_user2_follow'],
      where: {
        fk_user1_follow: pk_id_user,
        fk_user2_follow: profile_logged
      }
    });}  

    console.log(profile_logged, pk_id_user, isFollowed)
    if (isFollowed) {
      // Se já existir um "like", exclua-o
      await Follow.destroy({
        where: {
          fk_user1_follow: pk_id_user,
          fk_user2_follow: profile_logged
        }
      });

      return res.status(200).send('Desseguido com sucesso.');
    } else if (profile_logged, pk_id_user){
      // Se não existir um "like", crie-o
      await Follow.create({
        fk_user1_follow: pk_id_user,
        fk_user2_follow: profile_logged
      })

      return res.status(200).send('Seguido com sucesso.');
    }
  } catch (error) {
    // Logue o erro para fins de depuração
    console.error('Erro ao suspender o usuário:', error);

    // Responda com um erro ao cliente
    return res.status(500).json({ error: 'Erro ao suspender o usuário' });
  }

});
app.get('/edit', verifyToken, async (req, res) => {
  const user = await UsuarioL.findOne({
    attributes: ['pk_id_user', 'name_user', 'email_user', 'pfp_user', 'pass_user', 'follower_user', 'following_user'], 
    where:{
      pk_id_user: req.decoded.pk_id_user
    }
  }); 
  if(user ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:"erro usuario ou a senha estão incorretos! este email não foi encontrado"
    })
  }

  const userData = { 
    pfp_user: user.pfp_user,
    name_user: user.name_user,
    email_user: user.email_user,
    pass_user: user.pass_user
  }
  return res.json(userData)

});

//========================== Pattern ========================

app.get('/user_pattern', verifyToken, async (req, res) => {
  const profile_query = req.query.profile_query;
  const patt = await Pattern.findAll({
    attributes: ['pk_id_patt', 'fk_id_user', 'img_patt1'], 
    where: {
      fk_id_user: profile_query ? profile_query : req.decoded.pk_id_user
    }
  }); 

  if (patt.length === 0) {
    return res.status(404).json({
      erro: true,
      mensagem: "Pattern não encontrado"
    });
  }

  const img_patts = patt.map(item => item.img_patt1);

  // Envia o pk_id por JSON
  const pk_id_patts = patt.map(item => item.pk_id_patt);

  return res.json({ img_patts, pk_id_patts });
});

app.get('/explore', async (req, res) => {
  try {
    const patterns = await Pattern.findAll({
      attributes: ['pk_id_patt', 'title_patt', 'img_patt1', 'img_patt2'], // Corrigi 'img_patt1' duplicado
      include: [
        {
          model: UsuarioL,
          attributes: ['name_user', 'pfp_user']
        },
        {
          model: CommentL, // Adicionei o modelo Comment para incluir os comentários
          attributes: [] // Você pode incluir atributos específicos se necessário
        }
      ]
    });

    if (patterns.length === 0) {
      return res.status(404).json({
        erro: true,
        mensagem: "Pattern não encontrado"
      });
    }

    const patternsWithDetails = await Promise.all(patterns.map(async (pattern) => {
      const likes = await Likes.findAll({
        attributes: ['pk_id_like'],
        where: {
          fk_id_patt: pattern.pk_id_patt
        }
      });
      const numberLikes = likes.length;

      const comments = await CommentL.findAll({
        attributes: ['pk_id_comm'],
        where: {
          fk_id_patt: pattern.pk_id_patt
        }
      });
      const numberComments = comments.length;

      return {
        ...pattern.toJSON(),
        numberLikes,
        numberComments
      };
    }));

    return res.json({ patterns: patternsWithDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: true,
      mensagem: "Ocorreu um erro ao buscar os dados do usuário e dos padrões."
    });
  }
});


app.get('/results', async (req, res) => {
  const search_query = req.query.search_query;
  const tab_query = req.query.tab_query;
  const dec_query = req.query.dec_query;
  const size_query = req.query.size_query;
  const tag_query = req.query.tag_query;

  try {
    let patterns = '';

    const whereCondition = {};
    const nameWhere = {}
    if (tab_query == 1 && search_query !== '') {
      nameWhere.name_user = {
        [Op.like]: `%${search_query.trim()}%`,
      };
    } else if (tab_query == 3) {
      whereCondition.title_patt = {
        [Op.like]: `%${search_query}%`,
      };
    } else if (dec_query || size_query || tag_query) {
      if (dec_query) {
        whereCondition.fk_id_dec = dec_query;
      }

      if (size_query) {
        whereCondition.fk_id_size = size_query;
      }

      if (tag_query) {
        whereCondition.fk_id_tag = tag_query;
      }
    }
    console.log(nameWhere)
    patterns = await Pattern.findAll({
      attributes: ['pk_id_patt', 'title_patt', 'img_patt1', 'fk_id_tag'],
      include: [
        {
          model: UsuarioL,
          attributes: ['name_user', 'pfp_user'],
          where: nameWhere
        },
        {
          model: CommentL, // Adicionei o modelo Comment para incluir os comentários
          attributes: [] // Você pode incluir atributos específicos se necessário
        }
      ],
      
      where: whereCondition,
    })  

    console.log(patterns)


    if (patterns.length === 0) {
      return res.status(404).json({
        erro: true,
        mensagem: "Pattern não encontrado"
      });
    }

    const patternsWithDetails = await Promise.all(patterns.map(async (pattern) => {
      console.log('Pattern1', pattern)
      const likes = await Likes.findAll({
        attributes: ['pk_id_like', 'fk_id_patt'],
        where: {
          fk_id_patt: pattern.pk_id_patt
        }
      });
      const numberLikes = likes.length;

      const comments = await CommentL.findAll({
        attributes: ['pk_id_comm', 'fk_id_patt'],
        where: {
          fk_id_patt: pattern.pk_id_patt
        }
      });
      const numberComments = comments.length;

      return {
        ...pattern.toJSON(),
        numberLikes,
        numberComments
      };
    }));
    console.log('Pattern2:', patternsWithDetails)

    return res.json({ patterns: patternsWithDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: true,
      mensagem: "Ocorreu um erro ao buscar os dados do usuário e dos padrões."
    });
  }
});


app.get('/search_info', async (req, res) => {
  const user = await UsuarioL.findAll({
    attributes: ['pk_id_user', 'nick_user', 'name_user', 'pfp_user']
  }); 
  if(user ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:"erro usuario ou a senha estão incorretos! este email não foi encontrado"
    })
  }

  const tag = await Tags.findAll({
    attributes: ['title_tag'],
  }); 
  if(tag ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }

  const size = await Size.findAll({
    attributes: ['title_size'],
  }); 
  if(size ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }
  const dec = await Decade.findAll({
    attributes: ['title_dc'],
  }); 
  if(dec ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }
  const type = await Ptype.findAll({
    attributes: ['title_pt'],
  }); 
  if(type ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }
  const searchData = { 
    userData: user,
    decadeData: dec,
    typeData: type,
    tagData: tag,
    sizeData: size,
  }

  return res.json(searchData)
});

app.get('/search_info2', verifyToken, async (req, res) => {
  const user = await UsuarioL.findAll({
    attributes: ['pk_id_user', 'nick_user', 'name_user', 'pfp_user'],
  }); 
  if(user ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:"erro usuario ou a senha estão incorretos! este email não foi encontrado"
    })
  }

  const tag = await Tags.findAll({
    attributes: ['title_tag'],
  }); 
  if(tag ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }

  const size = await Size.findAll({
    attributes: ['title_size'],
  }); 
  if(size ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }
  const dec = await Decade.findAll({
    attributes: ['title_dc'],
  }); 
  if(dec ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }
  const type = await Ptype.findAll({
    attributes: ['title_pt'],
  }); 
  if(type ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:" Tags não encontradas"
    })
  }
  const searchData = { 
    userData: user.filter((user) => user.pk_id_user !== req.decoded.pk_id_user),
    decadeData: dec,
    typeData: type,
    tagData: tag,
    sizeData: size,
  }

  return res.json(searchData)
});

app.get('/postinfo', verifyToken , async (req, res) => {
  queryId = parseInt(req.query.pk_id_patt);
  const userId = req.decoded.pk_id_user
  if (isNaN(queryId) || queryId <= 0) {
    return res.status(400).json({
      erro: true,
      mensagem: "ID de padrão inválido"
    });
  }

  try {
    const post = await Pattern.findOne({
      attributes: ['pk_id_patt', 'img_patt1', 'img_patt2', 'img_patt3', 'pattern_patt', 'title_patt', 'desc_patt'], 
      include: [
        {
          model: UsuarioL,
          attributes: ['pk_id_user', 'name_user', 'pfp_user', 'isadm_user']
        },
        {
          model: Tags,
          attributes: ['title_tag']
        },
        {
          model: Size,
          attributes: ['title_size']
        },
        {
          model: CommentL,
          attributes: ['cont_comm'],
          include: [
            {
              model: UsuarioL,
              attributes: ['pk_id_user', 'name_user', 'pfp_user']
            }
          ]
        }
      ],
      where: {
        pk_id_patt: queryId
      }
    }); 
    const adm = await UsuarioL.findOne({
      attributes: ['isadm_user'], 
      
      where: {
        pk_id_user: userId
      }
    }); 

    if (!post) {
      return res.status(404).json({
        erro: true,
        mensagem: "Pattern não encontrado"
      });
    }
    
    return res.json({ 
      pk_id_patt: post.pk_id_patt,
      title_patt: post.title_patt,
      pattern_patt: post.pattern_patt,
      img_patt1: post.img_patt1,
      img_patt2: post.img_patt2,
      img_patt3: post.img_patt3,
      desc_patt: post.desc_patt,
      pk_id_user: post.UserL.pk_id_user,
      isadm_user: adm.isadm_user,
      name_user: post.UserL.name_user,
      pfp_user: post.UserL.pfp_user, 
      title_tag: post.tag.title_tag,
      title_size: post.size.title_size,
      comments: post.commentls.map(comment => ({
        cont_comm: comment.cont_comm,
        pk_id_user: comment.UserL ? comment.UserL.pk_id_user : null,
        name_user: comment.UserL ? comment.UserL.name_user : null,
        pfp_user: comment.UserL ? comment.UserL.pfp_user : null,
        bool_comment: comment.UserL.pk_id_user === userId ? true : false
      })),
    });

  } catch (error) {
    console.log(error)
    console.error("Erro ao consultar o banco de dados:", error);
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor"
    });
  }
});

app.get('/postinfo2' , async (req, res) => {
  const queryId = parseInt(req.query.pk_id_patt)
  if (isNaN(queryId) || queryId <= 0) {
    return res.status(400).json({
      erro: true,
      mensagem: "ID de padrão inválido"
    });
  }

  try {
    const post = await Pattern.findOne({
      attributes: ['pk_id_patt', 'img_patt1', 'img_patt2', 'img_patt3', 'pattern_patt', 'title_patt', 'desc_patt'], 
      include: [
        {
          model: UsuarioL,
          attributes: ['pk_id_user', 'name_user', 'pfp_user', 'isadm_user']
        },
        {
          model: Tags,
          attributes: ['title_tag']
        },
        {
          model: Size,
          attributes: ['title_size']
        },
        {
          model: CommentL,
          attributes: ['cont_comm'],
          include: [
            {
              model: UsuarioL,
              attributes: ['pk_id_user', 'name_user', 'pfp_user']
            }
          ]
        }
      ],
      where: {
        pk_id_patt: queryId
      }
    }); 

    if (!post) {
      return res.status(404).json({
        erro: true,
        mensagem: "Pattern não encontrado"
      });
    }
    
    return res.json({ 
      title_patt: post.title_patt,
      pattern_patt: post.pattern_patt,
      img_patt1: post.img_patt1,
      img_patt2: post.img_patt2,
      img_patt3: post.img_patt3,
      desc_patt: post.desc_patt,
      pk_id_user: post.UserL.pk_id_user,
      isadm_user: post.UserL.isadm_user,
      name_user: post.UserL.name_user,
      pfp_user: post.UserL.pfp_user, 
      title_tag: post.tag.title_tag,
      title_size: post.size.title_size,
      comments: post.commentls.map(comment => ({
        cont_comm: comment.cont_comm,
        name_user: comment.UserL ? comment.UserL.name_user : null,
        pfp_user: comment.UserL ? comment.UserL.pfp_user : null,
        bool_comment: false
      })),
    });

  } catch (error) {
    console.log(error)
    console.error("Erro ao consultar o banco de dados:", error);
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor"
    });
  }
})
app.post('/deletePost', async (req, res) => {
  const { pk_id_patt } = req.body;

  try {
    // Excluir registros dependentes na tabela commentl
    await CommentL.destroy({
      where: {
        fk_id_patt: pk_id_patt,
      },
    });

    // Agora, você pode excluir o post sem violar a restrição de chave estrangeira
    await Pattern.destroy({
      where: {
        pk_id_patt: pk_id_patt,
      },
    });

    // Responda com sucesso após a exclusão bem-sucedida
    return res.status(200).json({ success: true });
  } catch (error) {
    // Logue o erro para fins de depuração
    console.error('Erro ao excluir o post:', error);

    // Responda com um erro ao cliente
    return res.status(500).json({ error: 'Erro ao excluir o post' });
  }
});

app.post('/suspendUser', async (req, res) => {
  const {pk_id_user}  = req.body;
  const sus = 1
  console.log(pk_id_user)
  try {
    UsuarioL.update(
      {
        suspend_user: sus
      },
      {
        where: {pk_id_user: pk_id_user}
      }
    )

    // Responda com sucesso após a exclusão bem-sucedida
    return res.status(200);
  } catch (error) {
    // Logue o erro para fins de depuração
    console.error('Erro ao suspender o usuário:', error);

    // Responda com um erro ao cliente
    return res.status(500).json({ error: 'Erro ao suspender o usuário' });
  }
});
app.get('/suspendInfo', verifyToken,  async (req, res) => {
  const user = await UsuarioL.findOne({
    attributes: ['pk_id_user', 'suspend_user'], 
    where:{
      pk_id_user: req.decoded.pk_id_user
    }
  }) 
  if(user ===  null){
    return res.status(404).json({
      erro: true,
      mensagem:"erro usuario ou a senha estão incorretos! este email não foi encontrado"
    })
  }
  return res.json({
    suspend_user: user.suspend_user
  })

});
function runPythonScript(command, args) {
  return new Promise((resolve, reject) => {
    const python = spawn(command, args);
    let processed_data = '';

    python.stdout.on('data', (data) => {
      console.log('Data recebida:', data.toString());
      processed_data += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    python.on('exit', (code) => {
      console.log('Processo Python concluído. Código de saída:', code);
    
      if (code === 0) {
        console.log(processed_data)
        resolve(processed_data.trim())
      } else {
        reject(new Error(`Erro ao executar o script Python. Código de saída: ${code}`));
      }
    });

    python.on('error', (err) => {
      reject(new Error(`Erro ao iniciar o processo Python: ${err.message}`));
    });
  });
}

app.post('/search_by_image', upload.single('image'), async (req, res) => {
  try {
    const blobImage = req.file.buffer;
    if (!blobImage) {
      return res.status(400).send('O campo blobImage é obrigatório.');
    }

    console.log('blobImage length:', blobImage);

    const scriptPath = join(__dirname, 'python', 'describe.py');
    const processed_data = await runPythonScript('python', [scriptPath, blobImage]);

    console.log('Results:', processed_data.toString());
    return res.json({processed_data})
  } catch (error) {
    console.error('Erro ao processar a requisição:', error.message);
    res.status(500).send('Erro interno do servidor.');
  }
});





app.post('/createPost', verifyToken, async function (req,res) {
  const { title_patt, pattern_patt, img_patt1, img_patt2, img_patt3, desc_patt, fk_id_size, fk_id_tag, fk_id_dc, fk_id_pt } = req.body;
  console.log( title_patt, pattern_patt, img_patt1, img_patt2, img_patt3, desc_patt, fk_id_size, fk_id_tag, fk_id_dc, fk_id_pt)
  try{
  const createdPattern = await Pattern.create({
    title_patt,
    pattern_patt,
    img_patt1,
    img_patt2,
    img_patt3,
    desc_patt,
    fk_id_size,
    fk_id_tag,
    fk_id_dc,
    fk_id_pt,
    fk_id_user: req.decoded.pk_id_user
  });
  // Obtém o ID recém-criado
  const pk_id_patt = createdPattern.pk_id_patt;

  // Retorna o ID recém-criado como resposta
  return res.json({ pk_id_patt, message: 'Publicação criada com sucesso.' });
} catch (error) {
  return res.send('Houve um erro na criação da Publicação: ' + error);
}

})

// função criar comentario -----------------------------------------------------------------------------------------------------------
app.post('/CommentCreate', verifyToken, async (req, res) => {
  const { cont_comm } = req.body;

  try {
    // Certifique-se de que 'queryId' está definido antes de usá-lo
    if (!queryId) {
      return res.status(400).send('O ID da consulta não está definido.');
    }

    // Criação do comentário
    await CommentL.create({
      cont_comm,
      fk_id_patt: queryId,
      fk_id_user: req.decoded.pk_id_user
    });

    return res.sendStatus(200); // 201 Created
  } catch (error) {
    console.error('Erro na criação do comentário:', error);
    return res.status(500).send('Houve um erro na criação do comentário: ' + error);
  }
});





module.exports = routes;