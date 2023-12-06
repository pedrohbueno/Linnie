// chama bibliotecas e importa paginas ------------------------------------------------------------------------

const db = require('./connectionv');  
const { DataTypes } = require('sequelize');

// cria usuario no banco de dados -----------------------------------------------------------------------------
// area de inserts ---------------------------------------------------------------------------------------------
const UsuarioL = db.sequelize.define('UserL', {
      pk_id_user:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name_user: {
        type: DataTypes.STRING
      },
      email_user: {
        type: DataTypes.STRING
      },
      pfp_user: {
        type: DataTypes.STRING
      },
      pass_user: {
        type: DataTypes.STRING
      },
      conf_pass_user: {
        type: DataTypes.STRING
      },
      isadm_user: {
        type: DataTypes.INTEGER
      },
      suspend_user: {
        type: DataTypes.INTEGER
      },
      following_user: {
        type: DataTypes.STRING
      },
      follower_user: {
        type: DataTypes.STRING
      },
      fav_user: {
        type: DataTypes.INTEGER
      }
    }, {

    tableName: 'UserL', 
    timestamps: false

  }); 
  const Pattern = db.sequelize.define('pattern', {
    pk_id_patt:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title_patt: {
      type: DataTypes.STRING
    },
    pattern_patt: {
      type: DataTypes.STRING
    },
    img_patt1: {
      type: DataTypes.STRING
    },
    img_patt2: {
      type: DataTypes.STRING
    },
    img_patt3: {
      type: DataTypes.STRING
    },
    desc_patt: {
      type: DataTypes.STRING
    },
    fk_id_user: {
      type: DataTypes.INTEGER,
    },
    fk_id_tag: {
      type: DataTypes.INTEGER,
    },
    fk_id_size: {
      type: DataTypes.INTEGER,
    },
    fk_id_dc: {
      type: DataTypes.INTEGER
    }
  }, {

  tableName: 'pattern', 
  timestamps: false

}); 
const Tags = db.sequelize.define('tags', {
  pk_id_tag:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title_tag: {
    type: DataTypes.STRING
  }
}, {

tableName: 'tag', 
timestamps: false

}); 

const Likes = db.sequelize.define('like', {
  pk_id_like:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_id_patt: {
    type: DataTypes.INTEGER
  },
  fk_id_user: {
    type: DataTypes.INTEGER
  }
}, {

tableName: 'like', 
timestamps: false

}); 

const Follow = db.sequelize.define('follow', {
  pk_id_follow:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_user1_follow: {
    type: DataTypes.INTEGER
  },
  fk_user2_follow: {
    type: DataTypes.INTEGER
  }
}, {

tableName: 'follow', 
timestamps: false

}); 

const Ptype = db.sequelize.define('ptype', {
  pk_id_pt:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title_pt: {
    type: DataTypes.STRING
  }
}, {

tableName: 'ptype', 
timestamps: false

}); 

const Size = db.sequelize.define('size', {
  pk_id_size:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title_size: {
    type: DataTypes.STRING
  }
}, {

tableName: 'size', 
timestamps: false

}); 
const Decade = db.sequelize.define('decade', {
  pk_id_dc:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title_dc: {
    type: DataTypes.STRING
  }
}, {

tableName: 'decade', 
timestamps: false

}); 

const CommentL = db.sequelize.define('commentl', {
  pk_id_comm:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cont_comm: {
    type: DataTypes.STRING
  },
  fk_id_patt: {
    type: DataTypes.INTEGER
  },
  fk_id_user: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'commentl', 
  timestamps: false
}); 

module.exports = {
  UsuarioL,
  Pattern,
  Decade,
  Tags,
  Ptype,
  Size,
  CommentL,
  Likes,
  Follow

}