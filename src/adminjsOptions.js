import Arcans from '../models/Arcans.js'
import Category from '../models/Category.js';
import welcomePageDescription from '../models/WelcomePageDescription.js';
import User from '../models/User.js';
import {Components, componentLoader} from './components.js'
import passwordsFeature from '@adminjs/passwords';
import * as argon2 from 'argon2'

const adminOptions = {
    resources:[
      {resource: User,
      options:{
        navigation:{
          name:"Matrix app"
        },
        sort:{
          sortBy:'username',
          direction:'desc',
        },
        listProperties:["username", "email","roles"],
        properties:{
            password:{isVisible: false},
            roles:{
            type:'select',
            availableValues:[{
              value:'admin', label:'Администратор'
            },
            {
              value:'paidUser', label:'Оплативший пользователь'
            },
            {
              value:'user', label:'Пользователь'
            }
          ]
          }
        }
      },
      features: [
        passwordsFeature({
          componentLoader,
          properties: {
            encryptedPassword: 'password',
            password: 'newPassword'
          },
          hash: argon2.hash,
      })
    ]
    },
      {
        resource: Arcans,
        options: {
          navigation: {
            name: "Matrix app",
          },
          sort: {
            sortBy: 'category',
            direction: 'desc',
          },
          listProperties: ["category","title", "variant"],
          filterProperties:["title", "category","variant"],
          properties: {
            description: {
              type: "richtext",
            },
            category: {
              type:'reference',
              target: 'Category',
              isVisible:{
                list:true,
                filter:false,
                show:true,
                edit:true
              }
            },
            variant: {
              type: "select",
              availableValues: [
                { value: "soul_to_parents", label: "Для чего ваша душа пришла к родителям." },
                { value: "relations_task", label: "Задача отношений родителей с детьми." },
                {value: "errors_in_relations", label: "Ошибки во взаимоотношениях с родителями и своими детьми."},
                {value: "generic_power", label: "Сила рода"},
                { value: "generic_task", label: "Задачи рода"},
                {value: "personal_purpose", label:"Личное предназначение."},
                {value: "social_purpose", label:"Социальное предназначение."},
                {value: "spiritual_purpose", label:"Духовное предназначение."},
                {value: "planetary_purpose", label:"Планетарное предназначение."}
                // ... other values
              ],
            },
          },
          actions: {
            new: {
              after: async (response, request, context) => {
                const { record, notice } = response;
                if (record && notice.type === 'success') {
                  const categoryId = record.params.category;
                  const arcanId = record.params._id;
                  await Category.findByIdAndUpdate(
                    categoryId,
                    { $push: { arcans: arcanId } },
                    { new: true, useFindAndModify: false }
                  );
                }
                return response;
              }
            },
            list: {
              before: async (request, context) => {
                  request.query.perPage = 50;
                  return request
              }
          }
      
            },
          },
        },
      {
        resource: Category,
        options: {
          navigation:{
            name:"Matrix app"
          },
          listProperties:['name', 'arcans'],
          filterProperties:['name'],
          properties: {
            arcans: {
              type:'reference',
              target:'Arcans',
              isVisible: { list: true, edit: false, filter: true, show: true },
              components: {
                list:Components.ArcansList
                //show: AdminBro.bundle(path.join(__dirname, '/src/ArcansShow'))
              },
            },
          },
        },
      },{
        resource:welcomePageDescription,
        options:{
          navigation:{
            name:"Matrix app"
          },
          properties: {
            text: {
              type: "richtext",
            },
          }
        }
      }
    ],
    componentLoader,
    rootPath:"/admin"
  }

  export default adminOptions;