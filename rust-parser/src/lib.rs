use wasm_bindgen::prelude::*;
use scraper::{Html, Selector};

#[wasm_bindgen]
pub fn reverse( text: &str ) -> String {
    text.split_whitespace().rev().collect::<Vec<&str>>().join( " " )
}

#[wasm_bindgen]
pub fn factorial( x: u64 ) -> u64 {
    match x {
        0 | 1 => 1,
        _ => x * factorial( x - 1 ),
    }
}

#[wasm_bindgen]
pub fn html_cest_de_leau() -> String {
    let html2 = r#"<a class="page-numbers" href="https://menu-vegetarien.com/recettes/page/97/"><span class="elementor-screen-only">Page</span>97</a>"#;

    let fragment = Html::parse_fragment(html2);
    let selector = Selector::parse("a").unwrap();
    let h1 = fragment.select(&selector).next().unwrap();
    h1.inner_html()
}

#[wasm_bindgen]
pub fn parse_pages_number( html: &str ) -> i32 {
    let html = Html::parse_fragment(html);
    let selector = Selector::parse("a.page-numbers").unwrap();
    let _selector2 = Selector::parse("span.elementor-screen-only").unwrap();

    let balise = html.select(&selector).last().unwrap();
    let text = balise.text().collect::<Vec<_>>();
    
    return text.last().unwrap().parse::<i32>().unwrap();
}
